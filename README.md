
# aspirational-clover

This solution requires ***Visual Studio*** and a working local installations of ***node.js*** and ***git***,
as well as ***Angular CLI tools***. Additionally, the standard Web Development modules for Visual Studio 
must be installed to run the solution. Contact me directly if you wish to run the solution 
and have trouble doing so.

## Running the full stack in Visual Studio

Clone the solution, run Clean followed by Rebuild, then run the solution with ***https***. After a few
minutes, your web browser should automatically open to the Aspire dashboard. You can then create
a new tab and open it to `https://localhost:7203/` to view the application running locally.
While the full stack is running, you can point your browser to `https://localhost:7203/scalar/v1` to view
the OpenAPI documentation in Scalar.

(NOTE CAREFULLY: it must say `https` and you will need to trust a local certificate or override your standard
security settings, for instance by using a sandbox; if you want to run in `http` mode  then it should be possible but I'm
afraid you're on your own, because I only ever run this stack in `https`.) 


## Adding Shape Types

Shapes are model classes implementing `ILayerable`, as well as possibly `IFillable` and/or `ITransformable` or other interfaces. 
New shapes should be added in the `aspirational-clover.Server/Models` folder, and the `ShapeDTO` (properties AND constructor, specifically
the definition of the `LayerId` convenience property) must be updated to include
the new shape type. We use this scheme instead of a simple enum so that different shape types can express different properties and behaviors
(a shape should only implement the interfaces that are meaningful for that shape type). For example, a `Circle` has a `Radius` property, while a 
`Rectangle` has `Width` and `Height` properties. Besides updating `ShapeDTO`, it is also necessary to update the `DocumentService` class to
handle the new shape type; this includes the `getShapes` method, as well as the methods for creating, updating, and deleting documents.


_The entire commit history of this README.md file is relevant for historical interest._
