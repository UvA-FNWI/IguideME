export alias frontend-dev = pnpm -C ($env.PWD | path join IguideME.Web/Frontend/) dev
export alias mock-frontend = pnpm -C ($env.PWD | path join IguideME.Web/Frontend/) mock
export alias iguideme-packages = pnpm -C ($env.PWD | path join IguideME.Web/Frontend/) 
export alias backend-dev = dotnet watch --project $"($env.PWD)/IguideME.Web/" --no-hot-reload
export alias enter-db = litecli $"($env.PWD)/IguideME.Web/db.sqlite"
export alias bright-db = litecli $"($env.PWD)/IguideME.Web/brightspace.db"
export alias logs = kubectl logs $env.KUBECTL_PROJ_ID -n iguideme

export alias refresh-logs = load-env {KUBECTL_PROJ_ID: $"(kubectl get pods -n iguideme | find Running | first | split row ' ' | first | ansi strip)"}

export def display_help [] {
  $"You can use the following assist commands:

  ---Frontend------------------------------------------------------------------
    (ansi {fg: '#b7bdf8'}) frontend-dev              (ansi {fg: '#c6a0f6'})Build and run the frontend \(watcher)(ansi reset)
    (ansi {fg: '#b7bdf8'}) mock-frontend             (ansi {fg: '#c6a0f6'})Run the frontend with mocking \(watcher)(ansi reset)
    (ansi {fg: '#b7bdf8'}) iguideme-packages         (ansi {fg: '#c6a0f6'})Manage Node packages(ansi reset)
                                          
  ---Backend-------------------------------------------------------------------
    (ansi {fg: '#b7bdf8'}) backend-dev               (ansi {fg: '#c6a0f6'})Build and run the backend \(watcher)(ansi reset)
    (ansi {fg: '#b7bdf8'}) enter-db                  (ansi {fg: '#c6a0f6'})Enter the database(ansi reset)
    (ansi {fg: '#b7bdf8'}) bright-db                 (ansi {fg: '#c6a0f6'})Enter the brightspace database(ansi reset)
                                          
  ---Admin---------------------------------------------------------------------
    (ansi {fg: '#b7bdf8'}) logs                      (ansi {fg: '#c6a0f6'})View production logs(ansi reset)
    (ansi {fg: '#b7bdf8'}) refresh-logs              (ansi {fg: '#c6a0f6'})Refresh pod name for logs(ansi reset)
                                          
  ---Misc----------------------------------------------------------------------
    (ansi {fg: '#b7bdf8'}) h                         (ansi {fg: '#c6a0f6'})Display this message again(ansi reset)
 "
}

