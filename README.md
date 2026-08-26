
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

## Test suite

From the root of the solution, run:

`dotnet test aspirational-clover.Tests`

## PostgreSQL

For running locally, an in-memory database is used; however, in production mode, we use PostgreSQL. The dummy connection string is stored 
in `appsettings.json` and can be overridden by environment variables. Note that since this application centers around the concept
of a 'document', we might expect to use a NoSQL solution. However, the application is intended as an analogy to a real-world business
application, such as a shopping cart; just as a shopping cart has items, a `Document` has `Layer`s. Moreover, just as an item can have
parts, a `Layer` can have shapes (`Circle`s, `Rectangle`s, etc.). Thus the on-screen representation of a `Document` as a collection of `Layer`s
containing shapes is analogous to a shopping cart containing items which are themselves composed of parts.

