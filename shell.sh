#!/usr/bin/env bash

PROJECT_ROOT=$PWD;
FRONTEND_ROOT="$PROJECT_ROOT/IguideME.Web/Frontend"

echo "Checking node modules..."
pnpm --cwd $FRONTEND_ROOT install;


alias frontend-dev='pnpm -C $FRONTEND_ROOT dev'
alias frontend-build='pnpm -C $FRONTEND_ROOT build'
alias mock-frontend='pnpm -C $FRONTEND_ROOT mock'
alias iguideme-packages='pnpm -C $FRONTEND_ROOT'
alias backend-dev='dotnet watch --project $PROJECT_ROOT/IguideME.Web/ --no-hot-reload';
alias increment-versions=`lq -y -i '(.version, .appVersion) |= split(".") as $parts | $parts | .[-1] |= (. | tonumber + 1 ) | join(".")' $PROJECT_ROOT/charts/iguideme/Chart.yaml; lq -y -i '(.version, .appVersion) |= split(".") as $parts | $parts | .[-1] |= (. | tonumber + 1 ) | join(".")' $PROJECT_ROOT/charts/iguideme-demo/Chart.yaml`
alias enter-db='litecli $PROJECT_ROOT/IguideME.Web/db.sqlite';
alias bright-db='litecli $PROJECT_ROOT/IguideME.Web/brightspace.db';
alias logs='kubectl logs $KUBECTL_PROJ_ID -n iguideme';
alias refresh-logs='KUBECTL_PROJ_ID=$(kubectl get pods -n iguideme | grep Running | awk '\''{print $1}'\'')'
alias h='display_help()';

display_help() {
  local c='\e[36m'
  local m='\e[95m'
  local e='\e[0m'
  local HELP=$(cat << END
You can use the following assist commands:

  ---Frontend------------------------------------------------------------------
    ${m}frontend-dev              ${c}Build and run the frontend (watcher)${e}
    ${m}frontend-build            ${c}Build the frontend${e}
    ${m}mock-frontend             ${c}Run the frontend with mocking (watcher)${e}
    ${m}iguideme-packages         ${c}Manage Node packages${e}
                                          
  ---Backend-------------------------------------------------------------------
    ${m}backend-dev               ${c}Build and run the backend (watcher)${e}
    ${m}enter-db                  ${c}Enter the database${e}
    ${m}bright-db                 ${c}Enter the brightspace database${e}
                                          
  ---Admin---------------------------------------------------------------------
    ${m}increment-versions        ${c}Increment app versions in Chart.yml's${e}
    ${m}logs                      ${c}View production logs${e}
    ${m}refresh-logs              ${c}Refresh pod name for logs${e}
                                          
  ---Misc----------------------------------------------------------------------
    ${m}h                         ${c}Display this message again${e}
                                          

END
)
  echo -e "$HELP";
}


HEADER=$(cat << EOF
IIIII                 iii      dd        MM    MM EEEEEEE
 III   gggggg uu   uu          dd   eee  MMM  MMM EE
 III  gg   gg uu   uu iii  dddddd ee   e MM MM MM EEEEE
 III  ggggggg uu   uu iii dd   dd eeeee  MM    MM EE
IIIII      gg  uuuu u iii  dddddd  eeeee MM    MM EEEEEEE
       ggggg
EOF
)

echo -e "\n\e[34m$HEADER\e[0m\n\n";
display_help;
