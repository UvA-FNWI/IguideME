﻿FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
LABEL org.opencontainers.image.source=https://github.com/UvA-FNWI/IguideME
WORKDIR /app

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT [ "dotnet", "IguideME.Web.dll" ]
