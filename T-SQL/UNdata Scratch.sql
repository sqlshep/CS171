select top 100 * from undata

select top 100 * from hold

select top 100 * from country

--update country set countryname = replace(countryname, '"','') 

select * from education

select replace(countryname, '"','')  from country 





--select idkey, len(partner_code) from UNData where len(partner_code) > 20 order by len(partner_code) desc
select * from undata where idkey in(4401620)

select idkey, len(country) from UNData where len(country) > 3 order by len(country) desc

select age, count(*) from undata group by age 

update undata set age = -900 where age =  '-9421989850'
update undata set age = -900 where age in  ('-26876111361','-83856592971','-9421989850')

select avg(cast(age as int)) from undata where idkey not in (
select idkey from undata where age > 122 or age < 0) order by age 



update undata set age = 24 where idkey in (
select idkey from undata where age > 122 or age < 0)




USE [UN]
GO
/****** Object:  Table [dbo].[UNData]    Script Date: 3/21/2016 1:04:18 PM ******/
DROP TABLE [dbo].[UNData]
GO

CREATE TABLE [dbo].[UNData](
	[RowID] [bigint] NULL,
	[date] [varchar](46) NULL,
	[source] [varchar](250) NULL,
	[partner_code] [varchar](2000) NULL,
	[country] int NULL,
	[age] [int] NULL,
	[gender] [varchar](50) NULL,
	[education] [int] NULL,
	[priority1] [int] NULL,
	[priority2] [int] NULL,
	[priority3] [int] NULL,
	[priority4] [int] NULL,
	[priority5] [int] NULL,
	[priority6] [int] NULL
) ON [PRIMARY]

GO


select * from undataraw where country = 'NA'

update undataraw set country = 0 where country = 'NA'

select count(*) from undataraw where country > 194

update undataraw set country = 0 where country > 194

insert into UNData select * from UNDataRaw

create clustered columnstore index CCI_UNDATA on undata

--truncate table undata
