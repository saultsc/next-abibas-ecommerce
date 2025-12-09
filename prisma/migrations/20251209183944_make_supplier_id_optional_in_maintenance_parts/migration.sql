BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[addresses] (
    [address_id] INT NOT NULL IDENTITY(1,1),
    [person_id] INT NOT NULL,
    [address_line1] VARCHAR(200) NOT NULL,
    [address_line2] VARCHAR(200),
    [city_id] INT NOT NULL,
    [postal_code] VARCHAR(20) NOT NULL,
    [is_primary] BIT NOT NULL CONSTRAINT [DF__addresses__is_pr__123EB7A3] DEFAULT 0,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__addresses__state__1332DBDC] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__addresses__creat__14270015] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__addresses__updat__151B244E] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__addresse__CAA247C899DEC121] PRIMARY KEY CLUSTERED ([address_id])
);

-- CreateTable
CREATE TABLE [dbo].[categories] (
    [category_id] INT NOT NULL IDENTITY(1,1),
    [category_name] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__categorie__state__44FF419A] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__categorie__creat__45F365D3] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__categorie__updat__46E78A0C] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__categori__D54EE9B4CE91171D] PRIMARY KEY CLUSTERED ([category_id])
);

-- CreateTable
CREATE TABLE [dbo].[cities] (
    [city_id] INT NOT NULL IDENTITY(1,1),
    [province_id] INT NOT NULL,
    [city_name] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__cities__state__0B91BA14] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__cities__created___0C85DE4D] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__cities__updated___0D7A0286] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__cities__031491A8E2F028EA] PRIMARY KEY CLUSTERED ([city_id]),
    CONSTRAINT [UK_city_per_province] UNIQUE NONCLUSTERED ([province_id],[city_name])
);

-- CreateTable
CREATE TABLE [dbo].[colors] (
    [color_id] INT NOT NULL IDENTITY(1,1),
    [color_name] VARCHAR(50) NOT NULL,
    [hex_code] VARCHAR(7),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__colors__state__3F466844] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__colors__created___403A8C7D] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__colors__updated___412EB0B6] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__colors__1143CECBD17B43B0] PRIMARY KEY CLUSTERED ([color_id])
);

-- CreateTable
CREATE TABLE [dbo].[countries] (
    [country_id] INT NOT NULL IDENTITY(1,1),
    [country_name] VARCHAR(100) NOT NULL,
    [country_code] VARCHAR(3) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__countries__state__7D439ABD] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__countries__creat__7E37BEF6] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__countries__updat__7F2BE32F] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__countrie__7E8CD055F646DF57] PRIMARY KEY CLUSTERED ([country_id]),
    CONSTRAINT [UQ__countrie__F70188948CB2CAFE] UNIQUE NONCLUSTERED ([country_name]),
    CONSTRAINT [UQ__countrie__3436E9A599B1797D] UNIQUE NONCLUSTERED ([country_code])
);

-- CreateTable
CREATE TABLE [dbo].[customers] (
    [customer_id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [loyalty_points] INT NOT NULL CONSTRAINT [DF__customers__loyal__2DE6D218] DEFAULT 0,
    [total_spent] DECIMAL(12,2) NOT NULL CONSTRAINT [DF__customers__total__2EDAF651] DEFAULT 0.00,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__customers__creat__2FCF1A8A] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__customers__updat__30C33EC3] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__customer__CD65CB85A9685448] PRIMARY KEY CLUSTERED ([customer_id]),
    CONSTRAINT [UQ__customer__B9BE370E58DEFAC7] UNIQUE NONCLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[departments] (
    [department_id] INT NOT NULL IDENTITY(1,1),
    [department_name] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__departmen__state__4AB81AF0] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__departmen__creat__4BAC3F29] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__departmen__updat__4CA06362] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__departme__C2232422FAE4EB87] PRIMARY KEY CLUSTERED ([department_id])
);

-- CreateTable
CREATE TABLE [dbo].[document_types] (
    [document_type_id] INT NOT NULL IDENTITY(1,1),
    [type_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__document___state__286302EC] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__document___creat__29572725] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__document___updat__2A4B4B5E] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__document__69F7C2B1F49C73AA] PRIMARY KEY CLUSTERED ([document_type_id])
);

-- CreateTable
CREATE TABLE [dbo].[employees] (
    [employee_id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [hire_date] DATE NOT NULL,
    [department_id] INT,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__employees__creat__3587F3E0] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__employees__updat__367C1819] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__employee__C52E0BA8E480AF2D] PRIMARY KEY CLUSTERED ([employee_id]),
    CONSTRAINT [UQ__employee__B9BE370EE4362A52] UNIQUE NONCLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[movement_types] (
    [movement] VARCHAR(20) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__movement___state__5070F446] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__movement___creat__5165187F] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__movement___updat__52593CB8] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__movement__D20D5C05D7AC5A64] PRIMARY KEY CLUSTERED ([movement])
);

-- CreateTable
CREATE TABLE [dbo].[order_statuses] (
    [order_status_id] INT NOT NULL IDENTITY(1,1),
    [status_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__order_sta__state__5629CD9C] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__order_sta__creat__571DF1D5] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__order_sta__updat__5812160E] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__order_st__A499CF23E67B9347] PRIMARY KEY CLUSTERED ([order_status_id])
);

-- CreateTable
CREATE TABLE [dbo].[parties] (
    [party_id] INT NOT NULL IDENTITY(1,1),
    [party_type] VARCHAR(20) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__parties__state__68487DD7] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__parties__created__693CA210] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__parties__updated__6A30C649] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__parties__8A2AF38ED20C7D3E] PRIMARY KEY CLUSTERED ([party_id])
);

-- CreateTable
CREATE TABLE [dbo].[payment_methods] (
    [payment_method_id] INT NOT NULL IDENTITY(1,1),
    [method_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__payment_m__state__5BE2A6F2] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__payment_m__creat__5CD6CB2B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__payment_m__updat__5DCAEF64] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__payment___8A3EA9EB3BDEDD3B] PRIMARY KEY CLUSTERED ([payment_method_id])
);

-- CreateTable
CREATE TABLE [dbo].[persons] (
    [person_id] INT NOT NULL IDENTITY(1,1),
    [first_name] VARCHAR(100) NOT NULL,
    [last_name] VARCHAR(100) NOT NULL,
    [email] VARCHAR(100),
    [date_of_birth] DATE,
    [document_type_id] INT,
    [document_number] VARCHAR(50),
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__persons__created__6E01572D] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__persons__updated__6EF57B66] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__persons__543848DF8E582A6D] PRIMARY KEY CLUSTERED ([person_id])
);

-- CreateTable
CREATE TABLE [dbo].[phone_types] (
    [phone_type_id] INT NOT NULL IDENTITY(1,1),
    [type_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__phone_typ__state__2E1BDC42] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__phone_typ__creat__2F10007B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__phone_typ__updat__300424B4] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__phone_ty__F535ED3F1FE961CE] PRIMARY KEY CLUSTERED ([phone_type_id])
);

-- CreateTable
CREATE TABLE [dbo].[phones] (
    [phone_id] INT NOT NULL IDENTITY(1,1),
    [phone_type_id] INT NOT NULL,
    [person_id] INT NOT NULL,
    [phone_number] VARCHAR(20) NOT NULL,
    [is_primary] BIT NOT NULL CONSTRAINT [DF__phones__is_prima__72C60C4A] DEFAULT 0,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__phones__state__73BA3083] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__phones__created___74AE54BC] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__phones__updated___75A278F5] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__phones__E6BD6DD739D0081B] PRIMARY KEY CLUSTERED ([phone_id])
);

-- CreateTable
CREATE TABLE [dbo].[provinces] (
    [province_id] INT NOT NULL IDENTITY(1,1),
    [country_id] INT NOT NULL,
    [province_name] VARCHAR(100) NOT NULL,
    [province_code] VARCHAR(10),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__provinces__state__03F0984C] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__provinces__creat__04E4BC85] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__provinces__updat__05D8E0BE] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__province__08DCB60F4B5A2A04] PRIMARY KEY CLUSTERED ([province_id]),
    CONSTRAINT [UK_province_per_country] UNIQUE NONCLUSTERED ([country_id],[province_name])
);

-- CreateTable
CREATE TABLE [dbo].[roles] (
    [role_id] INT NOT NULL IDENTITY(1,1),
    [role_name] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__roles__state__33D4B598] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__roles__created_a__34C8D9D1] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__roles__updated_a__35BCFE0A] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__roles__760965CCA0E7F193] PRIMARY KEY CLUSTERED ([role_id])
);

-- CreateTable
CREATE TABLE [dbo].[shipping_statuses] (
    [status_code] VARCHAR(25) NOT NULL,
    [description] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__shipping___state__619B8048] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__shipping___creat__628FA481] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__shipping___updat__6383C8BA] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__shipping__4157B0202E67DBFF] PRIMARY KEY CLUSTERED ([status_code])
);

-- CreateTable
CREATE TABLE [dbo].[sizes] (
    [size_code] VARCHAR(10) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__sizes__state__398D8EEE] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__sizes__created_a__3A81B327] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__sizes__updated_a__3B75D760] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__sizes__4D990C7ADE1915A7] PRIMARY KEY CLUSTERED ([size_code])
);

-- CreateTable
CREATE TABLE [dbo].[states] (
    [state] VARCHAR(1) NOT NULL,
    [description] VARCHAR(100) NOT NULL,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__states__created___24927208] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__states__updated___25869641] DEFAULT CURRENT_TIMESTAMP,
    [created_by] INT,
    [updated_by] INT,
    CONSTRAINT [PK__states__A9360BC234CF4A24] PRIMARY KEY CLUSTERED ([state])
);

-- CreateTable
CREATE TABLE [dbo].[suppliers] (
    [supplier_id] INT NOT NULL IDENTITY(1,1),
    [person_id] INT NOT NULL,
    [company_name] VARCHAR(100),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__suppliers__state__1BC821DD] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__suppliers__creat__1CBC4616] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__suppliers__updat__1DB06A4F] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__supplier__6EE594E87342C091] PRIMARY KEY CLUSTERED ([supplier_id]),
    CONSTRAINT [UK_supplier_person] UNIQUE NONCLUSTERED ([person_id])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [user_id] INT NOT NULL IDENTITY(1,1),
    [person_id] INT NOT NULL,
    [username] VARCHAR(50) NOT NULL,
    [password] VARCHAR(100) NOT NULL,
    [role_id] INT,
    [last_login] DATETIME,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__users__state__25518C17] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__users__created_a__2645B050] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__users__updated_a__2739D489] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__users__B9BE370F4705AE9E] PRIMARY KEY CLUSTERED ([user_id]),
    CONSTRAINT [UK_user_person] UNIQUE NONCLUSTERED ([person_id]),
    CONSTRAINT [UQ__users__F3DBC5729C3AC51A] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[completed_maintenance] (
    [completed_maintenance_id] INT NOT NULL IDENTITY(1,1),
    [scheduled_maintenance_id] INT,
    [vehicle_id] INT NOT NULL,
    [maintenance_type_id] INT NOT NULL,
    [description] VARCHAR(1000) NOT NULL,
    [mileage_at_service] INT NOT NULL,
    [start_date] DATE NOT NULL,
    [completion_date] DATE,
    [supplier_id] INT NOT NULL,
    [total_cost] DECIMAL(12,2) NOT NULL CONSTRAINT [DF__completed__total__3EDC53F0] DEFAULT 0.00,
    [warranty_days] INT NOT NULL CONSTRAINT [DF__completed__warra__3FD07829] DEFAULT 0,
    [notes] VARCHAR(1000),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__completed__state__40C49C62] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__completed__creat__41B8C09B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__completed__updat__42ACE4D4] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__complete__AAC00D0E6F9F50FC] PRIMARY KEY CLUSTERED ([completed_maintenance_id])
);

-- CreateTable
CREATE TABLE [dbo].[deliveries] (
    [delivery_id] INT NOT NULL IDENTITY(1,1),
    [shipment_id] INT NOT NULL,
    [order_id] INT NOT NULL,
    [customer_id] INT NOT NULL,
    [received_by] VARCHAR(100),
    [delivery_date] DATETIME NOT NULL CONSTRAINT [DF__deliverie__deliv__6D9742D9] DEFAULT CURRENT_TIMESTAMP,
    [notes] VARCHAR(1000),
    [signature_url] VARCHAR(500),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__deliverie__state__6E8B6712] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__deliverie__creat__6F7F8B4B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__deliverie__updat__7073AF84] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__deliveri__1C5CF4F5EED61551] PRIMARY KEY CLUSTERED ([delivery_id])
);

-- CreateTable
CREATE TABLE [dbo].[fuel_logs] (
    [fuel_log_id] INT NOT NULL IDENTITY(1,1),
    [vehicle_id] INT NOT NULL,
    [driver_id] INT NOT NULL,
    [fill_date] DATE NOT NULL,
    [mileage] INT NOT NULL,
    [gallons] DECIMAL(8,3) NOT NULL,
    [cost_per_gallon] DECIMAL(8,3) NOT NULL,
    [total_cost] DECIMAL(17,6),
    [gas_station] VARCHAR(100),
    [invoice_number] VARCHAR(50),
    [notes] VARCHAR(500),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__fuel_logs__state__54CB950F] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__fuel_logs__creat__55BFB948] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__fuel_logs__updat__56B3DD81] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__fuel_log__78804E8470243182] PRIMARY KEY CLUSTERED ([fuel_log_id])
);

-- CreateTable
CREATE TABLE [dbo].[inventory_movements] (
    [movement_id] INT NOT NULL IDENTITY(1,1),
    [variant_id] INT NOT NULL,
    [movement] VARCHAR(20) NOT NULL,
    [quantity] INT NOT NULL,
    [reference_number] VARCHAR(50),
    [notes] VARCHAR(500),
    [movement_date] DATETIME NOT NULL CONSTRAINT [DF__inventory__movem__59C55456] DEFAULT CURRENT_TIMESTAMP,
    [created_by] INT,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__inventory__state__5AB9788F] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__inventory__creat__5BAD9CC8] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__inventory__updat__5CA1C101] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__inventor__AB1D102269DB80EA] PRIMARY KEY CLUSTERED ([movement_id])
);

-- CreateTable
CREATE TABLE [dbo].[maintenance_parts] (
    [maintenance_part_id] INT NOT NULL IDENTITY(1,1),
    [completed_maintenance_id] INT NOT NULL,
    [part_description] VARCHAR(200) NOT NULL,
    [part_number] VARCHAR(100),
    [quantity] INT NOT NULL CONSTRAINT [DF__maintenan__quant__4A4E069C] DEFAULT 1,
    [unit_cost] DECIMAL(10,2) NOT NULL,
    [total_cost] DECIMAL(21,2),
    [supplier_id] INT,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__maintenan__state__4C364F0E] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__creat__4D2A7347] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__updat__4E1E9780] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__maintena__6F84A7BD616DCFAE] PRIMARY KEY CLUSTERED ([maintenance_part_id])
);

-- CreateTable
CREATE TABLE [dbo].[maintenance_statuses] (
    [maintenance_status_id] INT NOT NULL IDENTITY(1,1),
    [status_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__maintenan__state__2F9A1060] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__creat__308E3499] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__updat__318258D2] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__maintena__234CAC543889AF1E] PRIMARY KEY CLUSTERED ([maintenance_status_id])
);

-- CreateTable
CREATE TABLE [dbo].[maintenance_types] (
    [maintenance_type_id] INT NOT NULL IDENTITY(1,1),
    [type_name] VARCHAR(50) NOT NULL,
    [description] VARCHAR(255),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__maintenan__state__29E1370A] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__creat__2AD55B43] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__updat__2BC97F7C] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__maintena__162D5D0E95AF6FDD] PRIMARY KEY CLUSTERED ([maintenance_type_id])
);

-- CreateTable
CREATE TABLE [dbo].[order_items] (
    [order_id] INT NOT NULL,
    [variant_id] INT NOT NULL,
    [quantity] INT NOT NULL,
    [unit_price] DECIMAL(10,2) NOT NULL,
    [discount] DECIMAL(10,2) NOT NULL CONSTRAINT [DF__order_ite__disco__719CDDE7] DEFAULT 0.00,
    [subtotal] DECIMAL(22,2),
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__order_ite__creat__72910220] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__order_ite__updat__73852659] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__order_it__28F5A4A27EFD41F7] PRIMARY KEY CLUSTERED ([order_id],[variant_id])
);

-- CreateTable
CREATE TABLE [dbo].[orders] (
    [order_id] INT NOT NULL IDENTITY(1,1),
    [order_number] VARCHAR(50) NOT NULL,
    [customer_id] INT NOT NULL,
    [shipping_address_id] INT NOT NULL,
    [order_status_id] INT NOT NULL,
    [subtotal] DECIMAL(12,2) NOT NULL CONSTRAINT [DF__orders__subtotal__6442E2C9] DEFAULT 0.00,
    [tax_amount] DECIMAL(12,2) NOT NULL CONSTRAINT [DF__orders__tax_amou__65370702] DEFAULT 0.00,
    [shipping_cost] DECIMAL(10,2) NOT NULL CONSTRAINT [DF__orders__shipping__662B2B3B] DEFAULT 0.00,
    [discount_amount] DECIMAL(10,2) NOT NULL CONSTRAINT [DF__orders__discount__671F4F74] DEFAULT 0.00,
    [total_amount] DECIMAL(12,2) NOT NULL,
    [estimated_delivery_date] DATE,
    [actual_delivery_date] DATETIME,
    [notes] VARCHAR(500),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__orders__state__681373AD] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__orders__created___690797E6] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__orders__updated___69FBBC1F] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__orders__46596229F65880BC] PRIMARY KEY CLUSTERED ([order_id]),
    CONSTRAINT [UQ__orders__730E34DF62B815C1] UNIQUE NONCLUSTERED ([order_number])
);

-- CreateTable
CREATE TABLE [dbo].[payments] (
    [payment_id] INT NOT NULL IDENTITY(1,1),
    [order_id] INT NOT NULL,
    [payment_method_id] INT NOT NULL,
    [transaction_id] VARCHAR(100),
    [amount] DECIMAL(12,2) NOT NULL,
    [payment_date] DATETIME NOT NULL CONSTRAINT [DF__payments__paymen__793DFFAF] DEFAULT CURRENT_TIMESTAMP,
    [status] VARCHAR(20) NOT NULL CONSTRAINT [DF__payments__status__7A3223E8] DEFAULT 'COMPLETADO',
    [notes] VARCHAR(500),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__payments__state__7C1A6C5A] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__payments__create__7D0E9093] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__payments__update__7E02B4CC] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__payments__ED1FC9EA2518F1C6] PRIMARY KEY CLUSTERED ([payment_id])
);

-- CreateTable
CREATE TABLE [dbo].[product_images] (
    [image_id] INT NOT NULL IDENTITY(1,1),
    [product_id] INT NOT NULL,
    [image_url] VARCHAR(500) NOT NULL,
    [is_primary] BIT NOT NULL CONSTRAINT [DF__product_i__is_pr__5224328E] DEFAULT 0,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__product_i__state__531856C7] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__product_i__creat__540C7B00] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__product_i__updat__55009F39] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__product___DC9AC9557E833C26] PRIMARY KEY CLUSTERED ([image_id])
);

-- CreateTable
CREATE TABLE [dbo].[product_variants] (
    [variant_id] INT NOT NULL IDENTITY(1,1),
    [product_id] INT NOT NULL,
    [color_id] INT NOT NULL,
    [size_code] VARCHAR(10) NOT NULL,
    [price_adjustment] DECIMAL(10,2) NOT NULL CONSTRAINT [DF__product_v__price__45BE5BA9] DEFAULT 0.00,
    [stock_quantity] INT NOT NULL CONSTRAINT [DF__product_v__stock__46B27FE2] DEFAULT 0,
    [reorder_level] INT NOT NULL CONSTRAINT [DF__product_v__reord__489AC854] DEFAULT 10,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__product_v__state__498EEC8D] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__product_v__creat__4A8310C6] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__product_v__updat__4B7734FF] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__product___EACC68B778014840] PRIMARY KEY CLUSTERED ([variant_id]),
    CONSTRAINT [UK_product_variant] UNIQUE NONCLUSTERED ([product_id],[color_id],[size_code])
);

-- CreateTable
CREATE TABLE [dbo].[products] (
    [product_id] INT NOT NULL IDENTITY(1,1),
    [product_name] VARCHAR(200) NOT NULL,
    [description] VARCHAR(1000),
    [price] DECIMAL(10,2) NOT NULL,
    [category_id] INT NOT NULL,
    [weight] DECIMAL(8,2),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__products__state__3E1D39E1] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__products__create__3F115E1A] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__products__update__40058253] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__products__47027DF52A61B797] PRIMARY KEY CLUSTERED ([product_id])
);

-- CreateTable
CREATE TABLE [dbo].[scheduled_maintenance] (
    [scheduled_maintenance_id] INT NOT NULL IDENTITY(1,1),
    [vehicle_id] INT NOT NULL,
    [maintenance_type_id] INT NOT NULL,
    [description] VARCHAR(500),
    [scheduled_mileage] INT,
    [scheduled_date] DATE NOT NULL,
    [supplier_id] INT,
    [estimated_cost] DECIMAL(10,2),
    [maintenance_status_id] INT NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__scheduled__state__3552E9B6] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__scheduled__creat__36470DEF] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__scheduled__updat__373B3228] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__schedule__D18DC10FB74A0410] PRIMARY KEY CLUSTERED ([scheduled_maintenance_id])
);

-- CreateTable
CREATE TABLE [dbo].[shipment_orders] (
    [shipment_id] INT NOT NULL,
    [order_id] INT NOT NULL,
    [sequence] INT NOT NULL CONSTRAINT [DF__shipment___seque__66EA454A] DEFAULT 1,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__shipment___creat__67DE6983] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__shipment___updat__68D28DBC] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__shipment__C523F87B362C6EB3] PRIMARY KEY CLUSTERED ([shipment_id],[order_id])
);

-- CreateTable
CREATE TABLE [dbo].[shipments] (
    [shipment_id] INT NOT NULL IDENTITY(1,1),
    [shipment_number] VARCHAR(50) NOT NULL,
    [vehicle_id] INT NOT NULL,
    [driver_id] INT NOT NULL,
    [status_code] VARCHAR(25) NOT NULL,
    [ship_date] DATETIME NOT NULL CONSTRAINT [DF__shipments__ship___5D60DB10] DEFAULT CURRENT_TIMESTAMP,
    [delivery_date] DATETIME,
    [notes] VARCHAR(1000),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__shipments__state__5E54FF49] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__shipments__creat__5F492382] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__shipments__updat__603D47BB] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__shipment__41466E5995A9B54C] PRIMARY KEY CLUSTERED ([shipment_id]),
    CONSTRAINT [UQ__shipment__18EE3BAF85AE4211] UNIQUE NONCLUSTERED ([shipment_number])
);

-- CreateTable
CREATE TABLE [dbo].[vehicle_document_types] (
    [document_type_id] INT NOT NULL IDENTITY(1,1),
    [type_name] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__vehicle_d__state__1B9317B3] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_d__creat__1C873BEC] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_d__updat__1D7B6025] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__vehicle___69F7C2B1EEDDAC61] PRIMARY KEY CLUSTERED ([document_type_id])
);

-- CreateTable
CREATE TABLE [dbo].[vehicle_documents] (
    [vehicle_document_id] INT NOT NULL IDENTITY(1,1),
    [vehicle_id] INT NOT NULL,
    [document_type_id] INT NOT NULL,
    [document_number] VARCHAR(100),
    [issuing_authority] VARCHAR(255),
    [issue_date] DATE,
    [expiration_date] DATE NOT NULL,
    [amount] DECIMAL(10,2),
    [is_valid] BIT NOT NULL CONSTRAINT [DF__vehicle_d__is_va__214BF109] DEFAULT 1,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__vehicle_d__state__22401542] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_d__creat__2334397B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_d__updat__24285DB4] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__vehicle___8C5AE53279BE6EBA] PRIMARY KEY CLUSTERED ([vehicle_document_id])
);

-- CreateTable
CREATE TABLE [dbo].[vehicle_statuses] (
    [vehicle_status_id] INT NOT NULL IDENTITY(1,1),
    [status_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__vehicle_s__state__09746778] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_s__creat__0A688BB1] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_s__updat__0B5CAFEA] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__vehicle___E8592AD2F25AD4BA] PRIMARY KEY CLUSTERED ([vehicle_status_id])
);

-- CreateTable
CREATE TABLE [dbo].[vehicle_types] (
    [vehicle_type_id] INT NOT NULL IDENTITY(1,1),
    [type_name] VARCHAR(100) NOT NULL,
    [description] VARCHAR(500),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__vehicle_t__state__03BB8E22] DEFAULT 'A',
    [load_capacity_kg] DECIMAL(10,2) NOT NULL,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_t__creat__04AFB25B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_t__updat__05A3D694] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__vehicle___2A00721881062776] PRIMARY KEY CLUSTERED ([vehicle_type_id])
);

-- CreateTable
CREATE TABLE [dbo].[vehicles] (
    [vehicle_id] INT NOT NULL IDENTITY(1,1),
    [vehicle_type_id] INT NOT NULL,
    [make] VARCHAR(100) NOT NULL,
    [model] VARCHAR(100) NOT NULL,
    [year] INT NOT NULL,
    [license_plate] VARCHAR(20) NOT NULL,
    [vin] VARCHAR(50),
    [engine_number] VARCHAR(50),
    [color] VARCHAR(50),
    [current_mileage] INT NOT NULL CONSTRAINT [DF__vehicles__curren__1209AD79] DEFAULT 0,
    [load_capacity_kg] DECIMAL(10,2) NOT NULL,
    [vehicle_status_id] INT NOT NULL,
    [supplier_id] INT,
    [purchase_date] DATE,
    [purchase_price] DECIMAL(12,2),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__vehicles__state__12FDD1B2] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__vehicles__create__13F1F5EB] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__vehicles__update__14E61A24] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__vehicles__F2947BC12344B2E4] PRIMARY KEY CLUSTERED ([vehicle_id]),
    CONSTRAINT [UQ__vehicles__F72CD56E38D68F61] UNIQUE NONCLUSTERED ([license_plate]),
    CONSTRAINT [UQ__vehicles__DDB00C66928A4D9E] UNIQUE NONCLUSTERED ([vin])
);

-- AddForeignKey
ALTER TABLE [dbo].[addresses] ADD CONSTRAINT [FK__addresses__city___17036CC0] FOREIGN KEY ([city_id]) REFERENCES [dbo].[cities]([city_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[addresses] ADD CONSTRAINT [FK__addresses__perso__160F4887] FOREIGN KEY ([person_id]) REFERENCES [dbo].[persons]([person_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[addresses] ADD CONSTRAINT [FK__addresses__state__17F790F9] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[categories] ADD CONSTRAINT [FK__categorie__state__47DBAE45] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[cities] ADD CONSTRAINT [FK__cities__province__0E6E26BF] FOREIGN KEY ([province_id]) REFERENCES [dbo].[provinces]([province_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[cities] ADD CONSTRAINT [FK__cities__state__0F624AF8] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[colors] ADD CONSTRAINT [FK__colors__state__4222D4EF] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[countries] ADD CONSTRAINT [FK__countries__state__00200768] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[customers] ADD CONSTRAINT [FK__customers__user___31B762FC] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[departments] ADD CONSTRAINT [FK__departmen__state__4D94879B] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[document_types] ADD CONSTRAINT [FK__document___state__2B3F6F97] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[employees] ADD CONSTRAINT [FK__employees__depar__3864608B] FOREIGN KEY ([department_id]) REFERENCES [dbo].[departments]([department_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[employees] ADD CONSTRAINT [FK__employees__user___37703C52] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[movement_types] ADD CONSTRAINT [FK__movement___state__534D60F1] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[order_statuses] ADD CONSTRAINT [FK__order_sta__state__59063A47] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[parties] ADD CONSTRAINT [FK__parties__state__6B24EA82] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[payment_methods] ADD CONSTRAINT [FK__payment_m__state__5EBF139D] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[persons] ADD CONSTRAINT [FK__persons__documen__6FE99F9F] FOREIGN KEY ([document_type_id]) REFERENCES [dbo].[document_types]([document_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[phone_types] ADD CONSTRAINT [FK__phone_typ__state__30F848ED] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[phones] ADD CONSTRAINT [FK__phones__person_i__76969D2E] FOREIGN KEY ([person_id]) REFERENCES [dbo].[persons]([person_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[phones] ADD CONSTRAINT [FK__phones__phone_ty__778AC167] FOREIGN KEY ([phone_type_id]) REFERENCES [dbo].[phone_types]([phone_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[phones] ADD CONSTRAINT [FK__phones__state__787EE5A0] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[provinces] ADD CONSTRAINT [FK__provinces__count__06CD04F7] FOREIGN KEY ([country_id]) REFERENCES [dbo].[countries]([country_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[provinces] ADD CONSTRAINT [FK__provinces__state__07C12930] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[roles] ADD CONSTRAINT [FK__roles__state__36B12243] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipping_statuses] ADD CONSTRAINT [FK__shipping___state__6477ECF3] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[sizes] ADD CONSTRAINT [FK__sizes__state__3C69FB99] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[suppliers] ADD CONSTRAINT [FK__suppliers__perso__1EA48E88] FOREIGN KEY ([person_id]) REFERENCES [dbo].[persons]([person_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[suppliers] ADD CONSTRAINT [FK__suppliers__state__1F98B2C1] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [FK__users__person_id__282DF8C2] FOREIGN KEY ([person_id]) REFERENCES [dbo].[persons]([person_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [FK__users__role_id__29221CFB] FOREIGN KEY ([role_id]) REFERENCES [dbo].[roles]([role_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [FK__users__state__2A164134] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[completed_maintenance] ADD CONSTRAINT [FK__completed__maint__4589517F] FOREIGN KEY ([maintenance_type_id]) REFERENCES [dbo].[maintenance_types]([maintenance_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[completed_maintenance] ADD CONSTRAINT [FK__completed__sched__43A1090D] FOREIGN KEY ([scheduled_maintenance_id]) REFERENCES [dbo].[scheduled_maintenance]([scheduled_maintenance_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[completed_maintenance] ADD CONSTRAINT [FK__completed__state__477199F1] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[completed_maintenance] ADD CONSTRAINT [FK__completed__suppl__467D75B8] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[suppliers]([supplier_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[completed_maintenance] ADD CONSTRAINT [FK__completed__vehic__44952D46] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]([vehicle_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[deliveries] ADD CONSTRAINT [FK__deliverie__custo__73501C2F] FOREIGN KEY ([customer_id]) REFERENCES [dbo].[customers]([customer_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[deliveries] ADD CONSTRAINT [FK__deliverie__order__725BF7F6] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([order_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[deliveries] ADD CONSTRAINT [FK__deliverie__shipm__7167D3BD] FOREIGN KEY ([shipment_id]) REFERENCES [dbo].[shipments]([shipment_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[deliveries] ADD CONSTRAINT [FK__deliverie__state__74444068] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fuel_logs] ADD CONSTRAINT [FK__fuel_logs__drive__589C25F3] FOREIGN KEY ([driver_id]) REFERENCES [dbo].[employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fuel_logs] ADD CONSTRAINT [FK__fuel_logs__state__59904A2C] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fuel_logs] ADD CONSTRAINT [FK__fuel_logs__vehic__57A801BA] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]([vehicle_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[inventory_movements] ADD CONSTRAINT [FK__inventory__creat__5F7E2DAC] FOREIGN KEY ([created_by]) REFERENCES [dbo].[employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[inventory_movements] ADD CONSTRAINT [FK__inventory__movem__5E8A0973] FOREIGN KEY ([movement]) REFERENCES [dbo].[movement_types]([movement]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[inventory_movements] ADD CONSTRAINT [FK__inventory__state__607251E5] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[inventory_movements] ADD CONSTRAINT [FK__inventory__varia__5D95E53A] FOREIGN KEY ([variant_id]) REFERENCES [dbo].[product_variants]([variant_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[maintenance_parts] ADD CONSTRAINT [FK__maintenan__compl__4F12BBB9] FOREIGN KEY ([completed_maintenance_id]) REFERENCES [dbo].[completed_maintenance]([completed_maintenance_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[maintenance_parts] ADD CONSTRAINT [FK__maintenan__state__50FB042B] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[maintenance_parts] ADD CONSTRAINT [FK__maintenan__suppl__5006DFF2] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[suppliers]([supplier_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[maintenance_statuses] ADD CONSTRAINT [FK__maintenan__state__32767D0B] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[maintenance_types] ADD CONSTRAINT [FK__maintenan__state__2CBDA3B5] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[order_items] ADD CONSTRAINT [FK__order_ite__order__74794A92] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([order_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[order_items] ADD CONSTRAINT [FK__order_ite__varia__756D6ECB] FOREIGN KEY ([variant_id]) REFERENCES [dbo].[product_variants]([variant_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [FK__orders__customer__6AEFE058] FOREIGN KEY ([customer_id]) REFERENCES [dbo].[customers]([customer_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [FK__orders__order_st__6CD828CA] FOREIGN KEY ([order_status_id]) REFERENCES [dbo].[order_statuses]([order_status_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [FK__orders__shipping__6BE40491] FOREIGN KEY ([shipping_address_id]) REFERENCES [dbo].[addresses]([address_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [FK__orders__state__6DCC4D03] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[payments] ADD CONSTRAINT [FK__payments__order___7EF6D905] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([order_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[payments] ADD CONSTRAINT [FK__payments__paymen__7FEAFD3E] FOREIGN KEY ([payment_method_id]) REFERENCES [dbo].[payment_methods]([payment_method_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[payments] ADD CONSTRAINT [FK__payments__state__00DF2177] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_images] ADD CONSTRAINT [FK__product_i__produ__55F4C372] FOREIGN KEY ([product_id]) REFERENCES [dbo].[products]([product_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_images] ADD CONSTRAINT [FK__product_i__state__56E8E7AB] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_variants] ADD CONSTRAINT [FK__product_v__color__4D5F7D71] FOREIGN KEY ([color_id]) REFERENCES [dbo].[colors]([color_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_variants] ADD CONSTRAINT [FK__product_v__produ__4C6B5938] FOREIGN KEY ([product_id]) REFERENCES [dbo].[products]([product_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_variants] ADD CONSTRAINT [FK__product_v__size___4E53A1AA] FOREIGN KEY ([size_code]) REFERENCES [dbo].[sizes]([size_code]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_variants] ADD CONSTRAINT [FK__product_v__state__4F47C5E3] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[products] ADD CONSTRAINT [FK__products__catego__40F9A68C] FOREIGN KEY ([category_id]) REFERENCES [dbo].[categories]([category_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[products] ADD CONSTRAINT [FK__products__state__41EDCAC5] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduled_maintenance] ADD CONSTRAINT [FK__scheduled__maint__39237A9A] FOREIGN KEY ([maintenance_type_id]) REFERENCES [dbo].[maintenance_types]([maintenance_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduled_maintenance] ADD CONSTRAINT [FK__scheduled__maint__3B0BC30C] FOREIGN KEY ([maintenance_status_id]) REFERENCES [dbo].[maintenance_statuses]([maintenance_status_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduled_maintenance] ADD CONSTRAINT [FK__scheduled__state__3BFFE745] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduled_maintenance] ADD CONSTRAINT [FK__scheduled__suppl__3A179ED3] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[suppliers]([supplier_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduled_maintenance] ADD CONSTRAINT [FK__scheduled__vehic__382F5661] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]([vehicle_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipment_orders] ADD CONSTRAINT [FK__shipment___order__6ABAD62E] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([order_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipment_orders] ADD CONSTRAINT [FK__shipment___shipm__69C6B1F5] FOREIGN KEY ([shipment_id]) REFERENCES [dbo].[shipments]([shipment_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [FK__shipments__drive__6225902D] FOREIGN KEY ([driver_id]) REFERENCES [dbo].[employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [FK__shipments__state__640DD89F] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [FK__shipments__statu__6319B466] FOREIGN KEY ([status_code]) REFERENCES [dbo].[shipping_statuses]([status_code]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [FK__shipments__vehic__61316BF4] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]([vehicle_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_document_types] ADD CONSTRAINT [FK__vehicle_d__state__1E6F845E] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_documents] ADD CONSTRAINT [FK__vehicle_d__docum__2610A626] FOREIGN KEY ([document_type_id]) REFERENCES [dbo].[vehicle_document_types]([document_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_documents] ADD CONSTRAINT [FK__vehicle_d__state__2704CA5F] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_documents] ADD CONSTRAINT [FK__vehicle_d__vehic__251C81ED] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]([vehicle_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_statuses] ADD CONSTRAINT [FK__vehicle_s__state__0C50D423] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_types] ADD CONSTRAINT [FK__vehicle_t__state__0697FACD] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicles] ADD CONSTRAINT [FK__vehicles__state__18B6AB08] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicles] ADD CONSTRAINT [FK__vehicles__suppli__17C286CF] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[suppliers]([supplier_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicles] ADD CONSTRAINT [FK__vehicles__vehicl__15DA3E5D] FOREIGN KEY ([vehicle_type_id]) REFERENCES [dbo].[vehicle_types]([vehicle_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicles] ADD CONSTRAINT [FK__vehicles__vehicl__16CE6296] FOREIGN KEY ([vehicle_status_id]) REFERENCES [dbo].[vehicle_statuses]([vehicle_status_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
