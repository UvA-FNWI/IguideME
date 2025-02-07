FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
LABEL org.opencontainers.image.source=https://github.com/UvA-FNWI/IguideME
WORKDIR /app

RUN curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs
RUN corepack enable pnpm


# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

ENV ASPNETCORE_HTTP_PORTS=80

ENTRYPOINT [ "dotnet", "IguideME.Web.dll" ]
