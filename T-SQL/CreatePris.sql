drop table Pri1
drop table Pri2
drop table Pri3
drop table Pri4
drop table Pri5
drop table Pri6
drop table [Priorities]
go

select country, 
	priority1,
	count(priority1) as priority1Response 
	into Pri1
from UNdata  UN join Country on (UN.country = country.countryid)
where priority1 is not null
group by country, priority1
order by country, priority1Response desc

select country, 
	priority2,
	count(priority2) as priority2Response 
	Into Pri2
from UNdata  UN join Country on (UN.country = country.countryid)
where priority2 is not null
group by country, priority2
order by country, priority2Response desc

select country, 
	priority3,
	count(priority3) as priority3Response 
	into Pri3
from UNdata  UN join Country on (UN.country = country.countryid)
where priority3 is not null
group by country, priority3
order by country, priority3Response desc

select country, 
	priority4,
	count(priority4) as priority4Response 
	into Pri4
from UNdata  UN join Country on (UN.country = country.countryid)
where priority4 is not null
group by country, priority4
order by country, priority4Response desc

select country, 
	priority5,
	count(priority5) as priority5Response 
	into Pri5
from UNdata  UN join Country on (UN.country = country.countryid)
where priority5 is not null
group by country, priority5
order by country, priority5Response desc

select country, 
	priority6,
	count(priority6) as priority6Response 
	into Pri6
from UNdata  UN join Country on (UN.country = country.countryid)
where priority6 is not null
group by country, priority6
order by country, priority6Response desc





CREATE TABLE [dbo].[Priorities](
	[country] [varchar](100) NULL,
	[priority1] [int] NULL,
	[priority1Response] [int] NULL,

	[priority2] [int] NULL,
	[priority2Response] [int] NULL,

	[priority3] [int] NULL,
	[priority3Response] [int] NULL,

	[priority4] [int] NULL,
	[priority4Response] [int] NULL,

	[priority5] [int] NULL,
	[priority5Response] [int] NULL,

	[priority6] [int] NULL,
	[priority6Response] [int] NULL,
) 


--select * from country
truncate table Priorities
go
declare @xtry int,
	@priority1 int,
	@priority1Response int,
	@priority2 int,
	@priority2Response int,
	@priority3 int,
	@priority3Response int,
	@priority4 int,
	@priority4Response int,
	@priority5 int,
	@priority5Response int,
	@priority6 int,
	@priority6Response int

select @xtry = min(countryID) from country

while @xtry is not null
begin
	SELECT @priority1 = priority1, @priority1Response = priority1Response from Pri1 where country = @xtry order by priority1Response 
	SELECT @priority2 = priority2, @priority2Response = priority2Response from Pri2 where country = @xtry order by priority2Response 
	SELECT @priority3 = priority3, @priority3Response = priority3Response from Pri3 where country = @xtry order by priority3Response 
	SELECT @priority4 = priority4, @priority4Response = priority4Response from Pri4 where country = @xtry order by priority4Response 
	SELECT @priority5 = priority5, @priority5Response = priority5Response from Pri5 where country = @xtry order by priority5Response 
	SELECT @priority6 = priority6, @priority6Response = priority6Response from Pri6 where country = @xtry order by priority6Response 


	insert into Priorities values(@xtry,@priority1,	@priority1Response,	@priority2,	@priority2Response, @priority3,	@priority3Response,	@priority4,	
		@priority4Response,	@priority5,	@priority5Response,	@priority6,	@priority6Response)
	
	select @xtry = min(countryID) from country where countryid > @xtry
end
go

update Priorities set country = countryName from country where countryid = Priorities.country


--select * from Pri6 order by country, priority6Response desc
--select * from Pri5 order by country, priority5Response desc
--select * from Pri4 order by country, priority4Response desc
--select * from Pri3 order by country, priority3Response desc
--select * from Pri2 order by country, priority2Response desc
--select * from Pri1 order by country, priority1Response desc



select * from Priorities


