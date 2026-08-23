var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.aspirational_clover_Server>("aspirational-clover-server");

builder.Build().Run();
