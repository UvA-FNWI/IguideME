let root = $env.PWD
let frontend = $root | path join IguideME.Web/Frontend/

# Install packages if they don't exist yet
^pnpm  -C $frontend install

alias frontend-dev = pnpm -C $frontend dev
alias mock-frontend = pnpm -C $frontend mock
alias iguideme-packages = pnpm -C $frontend 
alias backend-dev = dotnet watch --project $"($root)/IguideME.Web/" --no-hot-reload
alias enter-db = litecli $"($root)/IguideME.Web/db.sqlite"
alias bright-db = litecli $"($root)/IguideME.Web/brightspace.db"
alias logs = kubectl logs $env.KUBECTL_PROJ_ID -n iguideme

alias refresh-logs = load-env {KUBECTL_PROJ_ID: $"(kubectl get pods -n iguideme | find Running | first | split row ' ' | first | ansi strip)"}
