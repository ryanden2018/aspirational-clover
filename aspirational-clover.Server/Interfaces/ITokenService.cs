namespace aspirational_clover.Server.Interfaces
{
    /// <summary>
    /// Defines interface for a singleton Token service. This service is responsible for generating and validating tokens,
    /// which are used as a safeguard against CSRF attacks (in conjunction with a strong CSP policy). The service should
    /// be registered as a singleton because the service generates a unique in-memory cryptographic key at startup.
    /// This is fine because tokens are invalidated after a short interval (say one minute), and the key is only used for
    /// generating and validating tokens. The client app is responsible for requesting a token directly before initiating
    /// any mutation requests (POST, PUT, DELETE), and then the token is sent back to the server in a custom header (e.g.,
    /// X-CSRF-Token) for validation. Note that this safeguard can be easily bypassed if the client app is compromised or
    /// by using Postman or curl, but in combination with CSP it does effectively prevent most in-browser CSRF-style attacks.
    /// </summary>
    public interface ITokenService
    {
        /// <summary>
        /// Generates a new cryptographically secure token.
        /// </summary>
        /// <returns>A new token string with one-minute expiry.</returns>
        Task<string> GenerateToken();

        /// <summary>
        /// Validates the provided token against the in-memory key.
        /// </summary>
        /// <param name="token">The token to validate.</param>
        /// <returns>True if the token is valid and has not expired; otherwise, false.</returns>
        Task<bool> ValidateToken(string token);
    }
}
