using ChatRoom.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddSignalR();

// Configuring url for frontend connection
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("https://localhost:5017")
            .AllowAnyHeader()
            .WithMethods("GET", "POST")
            .SetIsOriginAllowed((host) => true)
            .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseCors();

app.MapRazorPages();
app.MapHub<ChatHub>("/chatHub");

app.Run();
