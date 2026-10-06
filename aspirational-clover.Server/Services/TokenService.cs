using System.Text;
using System.Security.Cryptography;

using aspirational_clover.Server.Interfaces;

namespace aspirational_clover.Server.Services;

/// <summary>
/// Service responsible for generating and validating cryptographically secure tokens.
/// </summary>
public class TokenService : ITokenService
{
    private readonly (string PrivateKeyPem, string PublicKeyPem) _signatureKeys;

    /// <summary>
    /// Initializes a new instance of the TokenService class.
    /// </summary>
    public TokenService()
    {
        _signatureKeys = GenerateSignatureKeys();
    }

    private byte[] SignData(byte[] dataToSign, string privateKeyPem)
    {
        using (RSA rsa = RSA.Create())
        {
            // Load the private key
            rsa.ImportFromPem(privateKeyPem);

            // Compute hash and sign (using SHA256 and Pkcs1 padding)
            return rsa.SignData(dataToSign, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
        }
    }

    private bool VerifyData(byte[] originalData, byte[] signature, string publicKeyPem)
    {
        using (RSA rsa = RSA.Create())
        {
            // Load the public key 
            rsa.ImportFromPem(publicKeyPem);

            // Verify the signature against the original data
            return rsa.VerifyData(originalData, signature, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
        }
    }

    private (string PrivateKeyPem, string PublicKeyPem) GenerateSignatureKeys()
    {
        // 3072-bit RSA key is recommended for 128-bit security strength
        using (RSA rsa = RSA.Create(3072))
        {
            // Export the Private Key (Keep this secure!)
            string privateKeyPem = rsa.ExportPkcs8PrivateKeyPem();

            // Export the Public Key (Distribute to clients/consumers)
            string publicKeyPem = rsa.ExportSubjectPublicKeyInfoPem();

            return (privateKeyPem, publicKeyPem);
        }
    }

    /// <summary>
    /// Represents a cryptographically secure token with a nonce, expiry, and signature.
    /// </summary>
    public class Token
    {
        /// <summary>
        /// Gets or sets the nonce (a unique random value) for the token.
        /// </summary>
        public string? Nonce { get; set; }

        /// <summary>
        /// Gets or sets the expiry time of the token in UTC format.
        /// </summary>
        public string? Expiry { get; set; }

        /// <summary>
        /// Gets or sets the cryptographic signature of the token, used for validation.
        /// </summary>
        public string? Signature { get; set; }
    }

    private byte[] GetBytesForToken(string nonce, string expiry)
    {
        return Encoding.UTF8.GetBytes($"{nonce}:{expiry}");
    }

    /// <summary>
    /// Generates a new cryptographically secure token.
    /// </summary>
    /// <returns>A new token string with one-minute expiry.</returns>
    public string GenerateToken()
    {
        var date = DateTime.UtcNow;
        var expiry = date.AddMinutes(1).ToString();
        var nonceBytes = new byte[32]; // 256-bit nonce
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(nonceBytes);
        }

        var nonce = Convert.ToBase64String(nonceBytes);
        var signature = Convert.ToBase64String(SignData(GetBytesForToken(nonce, expiry), _signatureKeys.PrivateKeyPem));
        Token token = new Token
        {
            Nonce = nonce,
            Expiry = expiry,
            Signature = signature
        };
        return System.Text.Json.JsonSerializer.Serialize(token);
    }

    /// <summary>
    /// Validates the provided token against the in-memory key.
    /// </summary>
    /// <param name="token">The token to validate.</param>
    /// <returns>True if the token is valid and has not expired; otherwise, false.</returns>
    public bool ValidateToken(string token)
    {
        try
        {
            var tokenObj = System.Text.Json.JsonSerializer.Deserialize<Token>(token);
            if (tokenObj == null) return false;
            // Check expiry
            if (DateTime.UtcNow > DateTime.Parse(tokenObj.Expiry ?? ""))
            {
                return false; // Token has expired
            }
            // Verify signature
            var dataToVerify = GetBytesForToken(tokenObj.Nonce ?? "", tokenObj.Expiry ?? "");
            var signatureBytes = Convert.FromBase64String(tokenObj.Signature ?? "");
            return VerifyData(dataToVerify, signatureBytes, _signatureKeys.PublicKeyPem);
        }
        catch
        {
            return false; // Invalid token format or other error
        }
    }
}
