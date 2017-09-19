# RpiWebCluster

Test project to compare performance between 8 clustered Raspberry Pi's and a "regular" web server.

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

