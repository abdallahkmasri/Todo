using Microsoft.EntityFrameworkCore;
using System.Text;
using TodoApi.Repositories;
using TodoApp.Data;
using TodoApp.Repositories;
using TodoApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TodoApp.Utilities;
using TodoApp.Middleware;

var builder = WebApplication.CreateBuilder(args);

// JWT configuration
// Hardcoded key and issuer settings
var key = Encoding.ASCII.GetBytes("My Secret Key For Todo App using JWT");
var issuer = "http://localhost:7126";
var audience = "http://localhost:4200";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // Optional: Reduce the default clock skew of 5 minutes
    };
});

var connectionString = builder.Configuration.GetConnectionString("TodoDatabase");
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlServer(connectionString));


// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});
builder.Services.AddHttpContextAccessor();

// Register repository and service implementations
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddControllers();

var app = builder.Build();

app.UseMiddleware<JwtUserIdMiddleware>();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

// Use CORS policy
app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
