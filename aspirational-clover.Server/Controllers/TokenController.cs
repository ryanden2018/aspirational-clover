using aspirational_clover.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace aspirational_clover.Server.Controllers;

/// <summary>
/// Controller for managing documents and their nested layers/shapes.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TokenController
{
    private ITokenService _tokenService;

    /// <summary>
    /// Initializes a new instance of the TokenController class.
    /// </summary>
    /// <param name="tokenService"></param>
    public TokenController(ITokenService tokenService)
    {
        _tokenService = tokenService;
    }


    /// <summary>
    /// Returns a new token for the user.
    /// </summary>
    /// <returns>Generated token</returns>
    [HttpGet(Name = "GetToken")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<ActionResult<string>> GetToken()
    {
        var token = await _tokenService.GenerateToken();
        return token;
    }
}
