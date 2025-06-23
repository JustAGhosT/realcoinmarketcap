-- Insert sample stamps from different eras
INSERT INTO stamps (sacc_number, title, description, issue_date, face_value, category_id, series_name, rarity_level) VALUES
-- 1960s
('196', '1961 Republic Festival', 'Commemorating the establishment of the Republic', '1961-05-31', 0.03, 2, 'Republic Series', 'rare'),
('234', '1964 Nursing', 'International Nursing commemoration', '1964-05-12', 0.025, 2, 'Healthcare Series', 'uncommon'),

-- 1970s
('312', '1974 UPU Centenary', 'Universal Postal Union 100th anniversary', '1974-10-09', 0.04, 2, 'UPU Series', 'uncommon'),
('356', '1976 Soweto Uprising Memorial', 'Commemorating the Soweto uprising', '1976-06-16', 0.05, 10, 'Historical Series', 'very_rare'),
('398', '1978 Aloe Series', 'South African indigenous aloes', '1978-03-15', 0.06, 3, 'Flora Series', 'common'),

-- 1980s
('445', '1982 SASOL II', 'SASOL synthetic fuel project', '1982-09-01', 0.12, 7, 'Industry Series', 'rare'),
('467', '1983 Fynbos', 'Cape floral kingdom fynbos', '1983-08-17', 0.15, 3, 'Flora Series', 'common'),
('523', '1986 Aviation Pioneers', 'South African aviation history', '1986-11-06', 0.25, 4, 'Aviation Series', 'uncommon'),
('578', '1988 Beetles', 'South African beetle species', '1988-04-14', 0.30, 3, 'Fauna Series', 'common'),

-- 1990s
('634', '1991 Succulents', 'Indigenous succulent plants', '1991-05-30', 0.35, 3, 'Flora Series', 'common'),
('689', '1994 Freedom Day', 'First democratic elections', '1994-04-27', 0.45, 10, 'Freedom Series', 'very_rare'),
('701', '1994 Mandela Inauguration', 'Presidential inauguration', '1994-05-10', 0.45, 10, 'Freedom Series', 'very_rare'),
('723', '1995 Big Five', 'African Big Five animals', '1995-07-20', 0.50, 3, 'Wildlife Series', 'uncommon'),
('756', '1996 Constitutional Court', 'New constitutional dispensation', '1996-02-02', 0.55, 10, 'Democracy Series', 'rare'),
('834', '1998 Mandela 80th Birthday', 'Nelson Mandela 80th birthday', '1998-07-18', 0.70, 2, 'Mandela Series', 'uncommon'),

-- 2000s
('912', '2000 Millennium', 'New millennium celebration', '2000-01-01', 1.00, 2, 'Millennium Series', 'common'),
('945', '2002 World Summit', 'World Summit on Sustainable Development', '2002-08-26', 1.20, 2, 'International Series', 'uncommon'),
('1023', '2004 Elections 10 Years', '10 years of democracy', '2004-04-27', 1.50, 10, 'Democracy Series', 'common'),
('1156', '2006 FIFA World Cup', 'FIFA World Cup in Germany', '2006-06-09', 2.00, 5, 'Sports Series', 'uncommon'),
('1234', '2008 Mandela 90th', 'Nelson Mandela 90th birthday', '2008-07-18', 2.50, 2, 'Mandela Series', 'common'),

-- 2010s
('1345', '2010 FIFA World Cup SA', 'FIFA World Cup in South Africa', '2010-06-11', 3.00, 5, 'World Cup Series', 'uncommon'),
('1456', '2013 Mandela Centenary', 'Nelson Mandela centenary preparations', '2013-07-18', 4.00, 2, 'Mandela Series', 'common'),
('1567', '2014 Elections 20 Years', '20 years of democracy', '2014-04-27', 4.50, 10, 'Democracy Series', 'common'),
('1678', '2016 Local Government', 'Local government elections', '2016-08-03', 5.00, 10, 'Democracy Series', 'common'),
('1789', '2018 Mandela Centenary', 'Nelson Mandela 100th birthday', '2018-07-18', 6.00, 2, 'Mandela Series', 'common'),

-- 2020s
('1890', '2020 COVID-19 Heroes', 'Healthcare workers during pandemic', '2020-12-01', 8.00, 2, 'Healthcare Series', 'uncommon'),
('1901', '2021 Heritage Sites', 'UNESCO World Heritage Sites', '2021-09-24', 9.00, 6, 'Heritage Series', 'common'),
('2012', '2022 Wetlands', 'South African wetland conservation', '2022-02-02', 10.00, 3, 'Conservation Series', 'common'),
('2123', '2023 BRICS Summit', 'BRICS Summit in South Africa', '2023-08-22', 12.00, 2, 'International Series', 'common'),
('2234', '2024 Elections 30 Years', '30 years of democracy', '2024-05-29', 15.00, 10, 'Democracy Series', 'common');
