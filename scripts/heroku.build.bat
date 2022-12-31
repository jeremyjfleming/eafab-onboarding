@echo off
cd web
heroku container:push web -a immense-earth-15924
heroku container:release web -a immense-earth-15924
cd ..\ 
cd api
heroku container:push web -a cryptic-spire-94586
heroku container:release web -a cryptic-spire-94586
cd ..\
