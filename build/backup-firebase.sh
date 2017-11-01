DATE=`date +%Y-%m-%d`
if [ -z "$1" ]
  then echo 'Usage: ./backup-firebase.sh project_name'
  exit 1
fi

echo 'Running backup for '$1
firebase database:get --project $1 --pretty --export -o $1.$DATE.json /
