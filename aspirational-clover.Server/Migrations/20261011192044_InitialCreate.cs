using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace aspirational_clover.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Circles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientUuid = table.Column<string>(type: "text", nullable: true),
                    LayerId = table.Column<int>(type: "integer", nullable: false),
                    FillColorFrom = table.Column<string>(type: "text", nullable: true),
                    FillColorTo = table.Column<string>(type: "text", nullable: true),
                    FillAngle = table.Column<float>(type: "real", nullable: false),
                    CenterX = table.Column<float>(type: "real", nullable: false),
                    CenterY = table.Column<float>(type: "real", nullable: false),
                    Radius = table.Column<float>(type: "real", nullable: false),
                    RotationAngle = table.Column<float>(type: "real", nullable: false),
                    RotationCenterOffsetX = table.Column<float>(type: "real", nullable: false),
                    RotationCenterOffsetY = table.Column<float>(type: "real", nullable: false),
                    SkewX = table.Column<float>(type: "real", nullable: false),
                    SkewY = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Circles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Documents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientUuid = table.Column<string>(type: "text", nullable: true),
                    DocumentSlug = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastUpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Layers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientUuid = table.Column<string>(type: "text", nullable: true),
                    DocumentId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Hidden = table.Column<bool>(type: "boolean", nullable: true),
                    ZIndex = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Layers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Polylines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientUuid = table.Column<string>(type: "text", nullable: true),
                    LayerId = table.Column<int>(type: "integer", nullable: false),
                    FillColorFrom = table.Column<string>(type: "text", nullable: true),
                    FillColorTo = table.Column<string>(type: "text", nullable: true),
                    FillAngle = table.Column<float>(type: "real", nullable: false),
                    Coords = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Polylines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rectangles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientUuid = table.Column<string>(type: "text", nullable: true),
                    LayerId = table.Column<int>(type: "integer", nullable: false),
                    FillColorFrom = table.Column<string>(type: "text", nullable: true),
                    FillColorTo = table.Column<string>(type: "text", nullable: true),
                    FillAngle = table.Column<float>(type: "real", nullable: false),
                    X = table.Column<float>(type: "real", nullable: false),
                    Y = table.Column<float>(type: "real", nullable: false),
                    Width = table.Column<float>(type: "real", nullable: false),
                    Height = table.Column<float>(type: "real", nullable: false),
                    RotationAngle = table.Column<float>(type: "real", nullable: false),
                    RotationCenterOffsetX = table.Column<float>(type: "real", nullable: false),
                    RotationCenterOffsetY = table.Column<float>(type: "real", nullable: false),
                    SkewX = table.Column<float>(type: "real", nullable: false),
                    SkewY = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rectangles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TextBoxes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientUuid = table.Column<string>(type: "text", nullable: true),
                    LayerId = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: true),
                    X = table.Column<int>(type: "integer", nullable: false),
                    Y = table.Column<int>(type: "integer", nullable: false),
                    FontSize = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextBoxes", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Circles");

            migrationBuilder.DropTable(
                name: "Documents");

            migrationBuilder.DropTable(
                name: "Layers");

            migrationBuilder.DropTable(
                name: "Polylines");

            migrationBuilder.DropTable(
                name: "Rectangles");

            migrationBuilder.DropTable(
                name: "TextBoxes");
        }
    }
}
