# RpiWebCluster

Test project to compare performance between 8 clustered Raspberry Pi's and a "regular" web server.

First using the rpi's for testing the web farm at work

Rpi_008 is the test server. The code is automatically uploaded to the rpi by phpStorm.
GitHub: git+https://github.com/gjgjwmertens/RpiWebCluster.git\

The code is committed and pushed from the rpi to github.
- git status
- git add . (staging)
- git commit -am "comment"
- git push origin master

There is a clone in D:\Projects\Electronica\Projects\RpiWebCluster\Code
- git pull origin master (get latest version)

The project uses a nodeJS express http server to show a web page and test web sockets.
I don't think it is necessary for the purpose of testing the web farm (needs verifying, see http_test.js)

MySQL Server
- sudo apt-get install mysql-server
- sudo apt-get install mysql-client (maybe not necessary, test)
- sudo apt-get install libmysql-java (maybe not necessary, test)
- creat root user
   mysql> CREATE USER 'monty'@'localhost' IDENTIFIED BY 'some_pass';
   mysql> GRANT ALL PRIVILEGES ON *.* TO 'monty'@'localhost'
       ->     WITH GRANT OPTION;
- edit my.cnf to allow external access
   - sudo nano /etc/mysql/my.cnf
   - change bind-address to 0.0.0.0
   - sudo service mysql restart
- npm install mysql --save
- query insert result
   - insert into:
      app.js::checkServerStatus result: OkPacket {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 34,
        serverStatus: 2,
        warningCount: 1,
        message: '',
        protocol41: true,
        changedRows: 0 }
   - select:
      app.js::checkServerStatus select result: [ RowDataPacket { 'count(*)': 61 } ]
      app.js::checkServerStatus select fields: [ FieldPacket {
          catalog: 'def',
          db: '',
          table: '',
          orgTable: '',
          name: 'count(*)',
          orgName: '',
          charsetNr: 63,
          length: 21,
          type: 8,
          flags: 129,
          decimals: 0,
          default: undefined,
          zeroFill: false,
          protocol41: true } ]

- Running the app at boot time !! this is not working out very well
   - open a terminal
      - sudo crontab -e
      - add the following line to the crontab file
      - @reboot sudo /usr/bin/node /home/pi/Documents/Projects/RpiWebCluster/app.js
   - to stop the task run sudo top to see the PID of the node task
   - then kill PID
