create table t_player (
	id serial,
	oldid int null,
  status int not null, 
  first_name TEXT not null,
  last_name TEXT not null,
  draft_year int not null,
  canonical_name TEXT not null unique,
  school_id int
);

create table t_school (
  id serial,
  name TEXT not null
);

create table t_position_eligibility (
  player_id int not null,
  position_id int not null,
  status int not null
);

create table t_measurement (
  id serial,
  status int not null,
  player_id int not null,
  measurable_id int not null,
  measurement double precision not null,
  source int not null
);


create view v_individual_measurements as 
select 
  p.id as id,
  case when (m.measurable_id = 1) then m.measurement else NULL end as height,
  case when (m.measurable_id = 2) then m.measurement else NULL end as weight,
  case when (m.measurable_id = 3) then m.measurement else NULL end as wingspan,
  case when (m.measurable_id = 4) then m.measurement else NULL end as arm_length,
  case when (m.measurable_id = 5) then m.measurement else NULL end as hand_size,
  case when (m.measurable_id = 6) then m.measurement else NULL end as time10,
  case when (m.measurable_id = 7) then m.measurement else NULL end as time20,
  case when (m.measurable_id = 8) then m.measurement else NULL end as time40,
  case when (m.measurable_id = 9) then m.measurement else NULL end as bench,
  case when (m.measurable_id = 10) then m.measurement else NULL end as vertical,
  case when (m.measurable_id = 11) then m.measurement else NULL end as broad,
  case when (m.measurable_id = 12) then m.measurement else NULL end as cone3,
  case when (m.measurable_id = 13) then m.measurement else NULL end as shuttle20,
  case when (m.measurable_id = 14) then m.measurement else NULL end as shuttle60,
  case when (m.measurable_id = 15) then m.measurement else NULL end as wonderlic 
from t_player p 
join t_measurement m
   on m.player_id = p.id;

create view v_best_measurements as 
select 
  id as id,
  max(height) as height,
  max(weight) as weight,
  max(wingspan) as wingspan,
  max(arm_length) as arm_length,
  max(hand_size) as hand_size,
  min(time10) as time10,
  min(time20) as time20,
  min(time40) as time40,
  max(bench) as bench,
  max(vertical) as vertical,
  max(broad) as broad,
  min(cone3) as cone3,
  min(shuttle20) as shuttle20,
  min(shuttle60) as shuttle60,
  max(wonderlic) as wonderlic
from v_individual_measurements
group by id;

create index i_measurement_player_id on t_measurement(player_id);
create index i_measurement_measurable_id on t_measurement(measurable_id);
create index i_player_canonical_name on t_player(canonical_name);