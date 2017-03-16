create SCHEMA web_cluster_stats;
use web_cluster_stats;

create table iis_alive_check (
   id int UNSIGNED PRIMARY KEY AUTO_INCREMENT,
   check_time date,
   status int,
   server_name varchar(255),
   server_ip varchar(255),
   result text
) engine=InnoDB;