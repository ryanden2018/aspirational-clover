namespace aspirational_clover.Server.Interfaces;

/// <summary>
/// Defines a contract for objects that can be associated with a specific layer, providing a LayerId property to identify the layer they belong to.
/// </summary>
public interface ILayerable
{
    /// <summary>
    /// Gets or sets the ID of the layer to which the object belongs.
    /// </summary>
    public int LayerId { get; set; }
}

