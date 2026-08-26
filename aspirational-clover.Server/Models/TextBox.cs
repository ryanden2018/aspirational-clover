namespace aspirational_clover.Server.Models;

using aspirational_clover.Server.Interfaces;

/// <summary>
/// Represents a text box with formatted text.
/// </summary>
public class TextBox : ILayerable
{    
    /// <summary>
    /// Gets or sets the unique ID for this text box.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the ID of the layer to which this text box belongs.
    /// </summary>
    public int LayerId { get; set; }

    /// <summary>
    /// The text content, represented as a JSON string which may be interpreted from the front-end as a
    /// rich text editor content. The server does not mutate this property; it is managed entirely
    /// by the client.
    /// </summary>
    public string? Content { get; set; }
}

