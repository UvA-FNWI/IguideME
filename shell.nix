{ pkgs ? import <nixpkgs> {} }:

with pkgs;

mkShell {
  buildInputs = [
    procps # for killing processes
    git
    cacert # for git certs
    nodejs
    nodePackages.npm
    nodePackages.yarn
    # dotnet-sdk_3 (fails on darwin-aarch64)
  ];

  shellHook = ''
    PROJECT_ROOT=$PWD;
    GIT_SSL_CAINFO=$HOME/.nix-profile/etc/ca-bundle.crt;

    kill-process() {
      ps ax | grep "$1" | grep -v grep | awk '{print $1}' | xargs kill
    }

    function cleanup {
      echo "Killing leftover processes...";
      #kill-process node 2> /dev/null;
    }
    trap cleanup EXIT;

    if [ ! -d $PWD/IguideME.Web/wwwroot/node_modules ]; then
      echo "Fetching node modules..."
      cd $PWD/IguideME.Web/wwwroot;
      yarn;
      cd $PWD;
    fi

    if ! command -v dotnet &> /dev/null
    then
      echo "Warning: dotnet could not be found, please install dotnet sdk 6."
    fi

    alias build-frontend-watch='yarn --cwd $PWD/IguideME.Web/wwwroot/ start'
    alias build-frontend-prod='yarn --cwd $PWD/IguideME.Web/wwwroot/ build'
    alias build-backend-watch='dotnet run --project $PWD/IguideME.Web/'
    alias build-backend-prod='dotnet build --project $PWD/IguideME.Web/'
    alias h='display_help';

    display_help () {
      echo "You can use the following assist commands:";
      echo "                                          ";
      echo "  ---frontend-----------------------------";
      echo "  build-frontend-watch    build the frontend (watch for changes)";
      echo "  build-frontend-prod     build the frontend for production";
      echo "                                          ";
      echo "  ---backend------------------------------";
      echo "  build-backend-watch     build the backend (watch for changes)";
      echo "  build-backend-prod      build the backend for production";
      echo "                                          ";
      echo "  ---administrative-----------------------";
      echo "  kill-process       kill a process by name";
      echo "                                          ";
      echo "  ---misc---------------------------------";
      echo "  h                  display this message again";
      echo "                                          ";
    }

    clear;

cat << EOF
IIIII                 iii      dd        MM    MM EEEEEEE
 III   gggggg uu   uu          dd   eee  MMM  MMM EE
 III  gg   gg uu   uu iii  dddddd ee   e MM MM MM EEEEE
 III  ggggggg uu   uu iii dd   dd eeeee  MM    MM EE
IIIII      gg  uuuu u iii  dddddd  eeeee MM    MM EEEEEEE
       ggggg


EOF

    display_help;
  '';
}
