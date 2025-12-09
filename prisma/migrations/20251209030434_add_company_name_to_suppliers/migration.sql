BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[addresses] (
    [address_id] INT NOT NULL IDENTITY(1,1),
    [party_id] INT NOT NULL,
    [address_line1] VARCHAR(200) NOT NULL,
    [address_line2] VARCHAR(200),
    [city] VARCHAR(100) NOT NULL,
    [state_province] VARCHAR(100) NOT NULL,
    [country] VARCHAR(100) NOT NULL,
    [postal_code] VARCHAR(20) NOT NULL,
    [is_primary] BIT NOT NULL CONSTRAINT [DF__addresses__is_pr__7D439ABD] DEFAULT 0,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__addresses__state__7E37BEF6] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__addresses__creat__7F2BE32F] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__addresses__updat__00200768] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__addresse__CAA247C808346C75] PRIMARY KEY CLUSTERED ([address_id])
);

-- CreateTable
CREATE TABLE [dbo].[categories] (
    [category_id] INT NOT NULL IDENTITY(1,1),
    [category_name] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__categorie__state__44FF419A] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__categorie__creat__45F365D3] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__categorie__updat__46E78A0C] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__categori__D54EE9B4CF6E2384] PRIMARY KEY CLUSTERED ([category_id])
);

-- CreateTable
CREATE TABLE [dbo].[colors] (
    [color_id] INT NOT NULL IDENTITY(1,1),
    [color_name] VARCHAR(50) NOT NULL,
    [hex_code] VARCHAR(7),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__colors__state__3F466844] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__colors__created___403A8C7D] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__colors__updated___412EB0B6] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__colors__1143CECBC02495A0] PRIMARY KEY CLUSTERED ([color_id])
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
    [total_cost] DECIMAL(12,2) NOT NULL CONSTRAINT [DF__completed__total__2AD55B43] DEFAULT 0.00,
    [warranty_days] INT NOT NULL CONSTRAINT [DF__completed__warra__2BC97F7C] DEFAULT 0,
    [notes] VARCHAR(1000),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__completed__state__2CBDA3B5] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__completed__creat__2DB1C7EE] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__completed__updat__2EA5EC27] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__complete__AAC00D0EE43A91D6] PRIMARY KEY CLUSTERED ([completed_maintenance_id])
);

-- CreateTable
CREATE TABLE [dbo].[customers] (
    [customer_id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [loyalty_points] INT NOT NULL CONSTRAINT [DF__customers__loyal__17F790F9] DEFAULT 0,
    [total_spent] DECIMAL(12,2) NOT NULL CONSTRAINT [DF__customers__total__18EBB532] DEFAULT 0.00,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__customers__creat__19DFD96B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__customers__updat__1AD3FDA4] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__customer__CD65CB8533513917] PRIMARY KEY CLUSTERED ([customer_id]),
    CONSTRAINT [UQ__customer__B9BE370EDCB24196] UNIQUE NONCLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[deliveries] (
    [delivery_id] INT NOT NULL IDENTITY(1,1),
    [shipment_id] INT NOT NULL,
    [order_id] INT NOT NULL,
    [customer_id] INT NOT NULL,
    [received_by] VARCHAR(100),
    [delivery_date] DATETIME NOT NULL CONSTRAINT [DF__deliverie__deliv__59904A2C] DEFAULT CURRENT_TIMESTAMP,
    [notes] VARCHAR(1000),
    [signature_url] VARCHAR(500),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__deliverie__state__5A846E65] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__deliverie__creat__5B78929E] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__deliverie__updat__5C6CB6D7] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__deliveri__1C5CF4F5B9AF77C5] PRIMARY KEY CLUSTERED ([delivery_id])
);

-- CreateTable
CREATE TABLE [dbo].[departments] (
    [department_id] INT NOT NULL IDENTITY(1,1),
    [department_name] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__departmen__state__4AB81AF0] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__departmen__creat__4BAC3F29] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__departmen__updat__4CA06362] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__departme__C22324223AAF951E] PRIMARY KEY CLUSTERED ([department_id])
);

-- CreateTable
CREATE TABLE [dbo].[document_types] (
    [document_type_id] INT NOT NULL IDENTITY(1,1),
    [type_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__document___state__286302EC] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__document___creat__29572725] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__document___updat__2A4B4B5E] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__document__69F7C2B1576E5D1A] PRIMARY KEY CLUSTERED ([document_type_id])
);

-- CreateTable
CREATE TABLE [dbo].[employees] (
    [employee_id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [hire_date] DATE NOT NULL,
    [department_id] INT,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__employees__creat__1F98B2C1] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__employees__updat__208CD6FA] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__employee__C52E0BA82E807F44] PRIMARY KEY CLUSTERED ([employee_id]),
    CONSTRAINT [UQ__employee__B9BE370E5EA9A3C1] UNIQUE NONCLUSTERED ([user_id])
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
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__fuel_logs__state__40C49C62] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__fuel_logs__creat__41B8C09B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__fuel_logs__updat__42ACE4D4] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__fuel_log__78804E8430AAA6C4] PRIMARY KEY CLUSTERED ([fuel_log_id])
);

-- CreateTable
CREATE TABLE [dbo].[inventory_movements] (
    [movement_id] INT NOT NULL IDENTITY(1,1),
    [variant_id] INT NOT NULL,
    [movement] VARCHAR(20) NOT NULL,
    [quantity] INT NOT NULL,
    [reference_number] VARCHAR(50),
    [notes] VARCHAR(500),
    [movement_date] DATETIME NOT NULL CONSTRAINT [DF__inventory__movem__45BE5BA9] DEFAULT CURRENT_TIMESTAMP,
    [created_by] INT,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__inventory__state__46B27FE2] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__inventory__creat__47A6A41B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__inventory__updat__489AC854] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__inventor__AB1D102295FDE49A] PRIMARY KEY CLUSTERED ([movement_id])
);

-- CreateTable
CREATE TABLE [dbo].[maintenance_parts] (
    [maintenance_part_id] INT NOT NULL IDENTITY(1,1),
    [completed_maintenance_id] INT NOT NULL,
    [part_description] VARCHAR(200) NOT NULL,
    [part_number] VARCHAR(100),
    [quantity] INT NOT NULL CONSTRAINT [DF__maintenan__quant__36470DEF] DEFAULT 1,
    [unit_cost] DECIMAL(10,2) NOT NULL,
    [total_cost] DECIMAL(21,2),
    [supplier_id] INT NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__maintenan__state__382F5661] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__creat__39237A9A] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__updat__3A179ED3] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__maintena__6F84A7BD7E859C80] PRIMARY KEY CLUSTERED ([maintenance_part_id])
);

-- CreateTable
CREATE TABLE [dbo].[maintenance_statuses] (
    [maintenance_status_id] INT NOT NULL IDENTITY(1,1),
    [status_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__maintenan__state__1B9317B3] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__creat__1C873BEC] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__updat__1D7B6025] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__maintena__234CAC5471A001F9] PRIMARY KEY CLUSTERED ([maintenance_status_id])
);

-- CreateTable
CREATE TABLE [dbo].[maintenance_types] (
    [maintenance_type_id] INT NOT NULL IDENTITY(1,1),
    [type_name] VARCHAR(50) NOT NULL,
    [description] VARCHAR(255),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__maintenan__state__15DA3E5D] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__creat__16CE6296] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__maintenan__updat__17C286CF] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__maintena__162D5D0E47AAF062] PRIMARY KEY CLUSTERED ([maintenance_type_id])
);

-- CreateTable
CREATE TABLE [dbo].[movement_types] (
    [movement] VARCHAR(20) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__movement___state__5070F446] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__movement___creat__5165187F] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__movement___updat__52593CB8] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__movement__D20D5C05C980BBFB] PRIMARY KEY CLUSTERED ([movement])
);

-- CreateTable
CREATE TABLE [dbo].[order_items] (
    [order_id] INT NOT NULL,
    [variant_id] INT NOT NULL,
    [quantity] INT NOT NULL,
    [unit_price] DECIMAL(10,2) NOT NULL,
    [discount] DECIMAL(10,2) NOT NULL CONSTRAINT [DF__order_ite__disco__5D95E53A] DEFAULT 0.00,
    [subtotal] DECIMAL(22,2),
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__order_ite__creat__5E8A0973] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__order_ite__updat__5F7E2DAC] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__order_it__28F5A4A2BB6D0D0C] PRIMARY KEY CLUSTERED ([order_id],[variant_id])
);

-- CreateTable
CREATE TABLE [dbo].[order_statuses] (
    [order_status_id] INT NOT NULL IDENTITY(1,1),
    [status_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__order_sta__state__5629CD9C] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__order_sta__creat__571DF1D5] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__order_sta__updat__5812160E] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__order_st__A499CF232CF8D063] PRIMARY KEY CLUSTERED ([order_status_id])
);

-- CreateTable
CREATE TABLE [dbo].[orders] (
    [order_id] INT NOT NULL IDENTITY(1,1),
    [order_number] VARCHAR(50) NOT NULL,
    [customer_id] INT NOT NULL,
    [shipping_address_id] INT NOT NULL,
    [order_status_id] INT NOT NULL,
    [subtotal] DECIMAL(12,2) NOT NULL CONSTRAINT [DF__orders__subtotal__503BEA1C] DEFAULT 0.00,
    [tax_amount] DECIMAL(12,2) NOT NULL CONSTRAINT [DF__orders__tax_amou__51300E55] DEFAULT 0.00,
    [shipping_cost] DECIMAL(10,2) NOT NULL CONSTRAINT [DF__orders__shipping__5224328E] DEFAULT 0.00,
    [discount_amount] DECIMAL(10,2) NOT NULL CONSTRAINT [DF__orders__discount__531856C7] DEFAULT 0.00,
    [total_amount] DECIMAL(12,2) NOT NULL,
    [estimated_delivery_date] DATE,
    [actual_delivery_date] DATETIME,
    [notes] VARCHAR(500),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__orders__state__540C7B00] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__orders__created___55009F39] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__orders__updated___55F4C372] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__orders__46596229DF278B25] PRIMARY KEY CLUSTERED ([order_id]),
    CONSTRAINT [UQ__orders__730E34DFB4F7E316] UNIQUE NONCLUSTERED ([order_number])
);

-- CreateTable
CREATE TABLE [dbo].[parties] (
    [party_id] INT NOT NULL IDENTITY(1,1),
    [party_type] VARCHAR(20) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__parties__state__68487DD7] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__parties__created__693CA210] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__parties__updated__6A30C649] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__parties__8A2AF38E77C918D0] PRIMARY KEY CLUSTERED ([party_id])
);

-- CreateTable
CREATE TABLE [dbo].[payment_methods] (
    [payment_method_id] INT NOT NULL IDENTITY(1,1),
    [method_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__payment_m__state__5BE2A6F2] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__payment_m__creat__5CD6CB2B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__payment_m__updat__5DCAEF64] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__payment___8A3EA9EBEC49D9F1] PRIMARY KEY CLUSTERED ([payment_method_id])
);

-- CreateTable
CREATE TABLE [dbo].[payments] (
    [payment_id] INT NOT NULL IDENTITY(1,1),
    [order_id] INT NOT NULL,
    [payment_method_id] INT NOT NULL,
    [transaction_id] VARCHAR(100),
    [amount] DECIMAL(12,2) NOT NULL,
    [payment_date] DATETIME NOT NULL CONSTRAINT [DF__payments__paymen__65370702] DEFAULT CURRENT_TIMESTAMP,
    [status] VARCHAR(20) NOT NULL CONSTRAINT [DF__payments__status__662B2B3B] DEFAULT 'COMPLETADO',
    [notes] VARCHAR(500),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__payments__state__681373AD] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__payments__create__690797E6] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__payments__update__69FBBC1F] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__payments__ED1FC9EABDF5937D] PRIMARY KEY CLUSTERED ([payment_id])
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
    CONSTRAINT [PK__persons__543848DF86B3C7D6] PRIMARY KEY CLUSTERED ([person_id])
);

-- CreateTable
CREATE TABLE [dbo].[phone_types] (
    [phone_type_id] INT NOT NULL IDENTITY(1,1),
    [type_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__phone_typ__state__2E1BDC42] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__phone_typ__creat__2F10007B] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__phone_typ__updat__300424B4] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__phone_ty__F535ED3F57B159C6] PRIMARY KEY CLUSTERED ([phone_type_id])
);

-- CreateTable
CREATE TABLE [dbo].[phones] (
    [phone_id] INT NOT NULL IDENTITY(1,1),
    [party_id] INT NOT NULL,
    [phone_type_id] INT NOT NULL,
    [person_id] INT NOT NULL,
    [phone_number] VARCHAR(20) NOT NULL,
    [is_primary] BIT NOT NULL CONSTRAINT [DF__phones__is_prima__73BA3083] DEFAULT 0,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__phones__state__74AE54BC] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__phones__created___75A278F5] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__phones__updated___76969D2E] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__phones__E6BD6DD7C726C3AC] PRIMARY KEY CLUSTERED ([phone_id])
);

-- CreateTable
CREATE TABLE [dbo].[product_images] (
    [image_id] INT NOT NULL IDENTITY(1,1),
    [product_id] INT NOT NULL,
    [image_url] VARCHAR(500) NOT NULL,
    [is_primary] BIT NOT NULL CONSTRAINT [DF__product_i__is_pr__3E1D39E1] DEFAULT 0,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__product_i__state__3F115E1A] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__product_i__creat__40058253] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__product_i__updat__40F9A68C] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__product___DC9AC955A7586C81] PRIMARY KEY CLUSTERED ([image_id])
);

-- CreateTable
CREATE TABLE [dbo].[product_variants] (
    [variant_id] INT NOT NULL IDENTITY(1,1),
    [product_id] INT NOT NULL,
    [color_id] INT NOT NULL,
    [size_code] VARCHAR(10) NOT NULL,
    [price_adjustment] DECIMAL(10,2) NOT NULL CONSTRAINT [DF__product_v__price__31B762FC] DEFAULT 0.00,
    [stock_quantity] INT NOT NULL CONSTRAINT [DF__product_v__stock__32AB8735] DEFAULT 0,
    [reorder_level] INT NOT NULL CONSTRAINT [DF__product_v__reord__3493CFA7] DEFAULT 10,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__product_v__state__3587F3E0] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__product_v__creat__367C1819] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__product_v__updat__37703C52] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__product___EACC68B733EF9C13] PRIMARY KEY CLUSTERED ([variant_id]),
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
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__products__state__2A164134] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__products__create__2B0A656D] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__products__update__2BFE89A6] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__products__47027DF52D5AECD6] PRIMARY KEY CLUSTERED ([product_id])
);

-- CreateTable
CREATE TABLE [dbo].[roles] (
    [role_id] INT NOT NULL IDENTITY(1,1),
    [role_name] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__roles__state__33D4B598] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__roles__created_a__34C8D9D1] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__roles__updated_a__35BCFE0A] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__roles__760965CCBC11DD10] PRIMARY KEY CLUSTERED ([role_id])
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
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__scheduled__state__214BF109] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__scheduled__creat__22401542] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__scheduled__updat__2334397B] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__schedule__D18DC10F53D4207B] PRIMARY KEY CLUSTERED ([scheduled_maintenance_id])
);

-- CreateTable
CREATE TABLE [dbo].[shipment_orders] (
    [shipment_id] INT NOT NULL,
    [order_id] INT NOT NULL,
    [sequence] INT NOT NULL CONSTRAINT [DF__shipment___seque__52E34C9D] DEFAULT 1,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__shipment___creat__53D770D6] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__shipment___updat__54CB950F] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__shipment__C523F87B34596E69] PRIMARY KEY CLUSTERED ([shipment_id],[order_id])
);

-- CreateTable
CREATE TABLE [dbo].[shipments] (
    [shipment_id] INT NOT NULL IDENTITY(1,1),
    [shipment_number] VARCHAR(50) NOT NULL,
    [vehicle_id] INT NOT NULL,
    [driver_id] INT NOT NULL,
    [status_code] VARCHAR(25) NOT NULL,
    [ship_date] DATETIME NOT NULL CONSTRAINT [DF__shipments__ship___4959E263] DEFAULT CURRENT_TIMESTAMP,
    [delivery_date] DATETIME,
    [notes] VARCHAR(1000),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__shipments__state__4A4E069C] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__shipments__creat__4B422AD5] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__shipments__updat__4C364F0E] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__shipment__41466E59B34C6379] PRIMARY KEY CLUSTERED ([shipment_id]),
    CONSTRAINT [UQ__shipment__18EE3BAF67D9ED7B] UNIQUE NONCLUSTERED ([shipment_number])
);

-- CreateTable
CREATE TABLE [dbo].[shipping_statuses] (
    [status_code] VARCHAR(25) NOT NULL,
    [description] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__shipping___state__619B8048] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__shipping___creat__628FA481] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__shipping___updat__6383C8BA] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__shipping__4157B0200631FD2E] PRIMARY KEY CLUSTERED ([status_code])
);

-- CreateTable
CREATE TABLE [dbo].[sizes] (
    [size_code] VARCHAR(10) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__sizes__state__398D8EEE] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__sizes__created_a__3A81B327] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__sizes__updated_a__3B75D760] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__sizes__4D990C7A8518C4F5] PRIMARY KEY CLUSTERED ([size_code])
);

-- CreateTable
CREATE TABLE [dbo].[states] (
    [state] VARCHAR(1) NOT NULL,
    [description] VARCHAR(100) NOT NULL,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__states__created___24927208] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__states__updated___25869641] DEFAULT CURRENT_TIMESTAMP,
    [created_by] INT,
    [updated_by] INT,
    CONSTRAINT [PK__states__A9360BC2E265AD92] PRIMARY KEY CLUSTERED ([state])
);

-- CreateTable
CREATE TABLE [dbo].[suppliers] (
    [supplier_id] INT NOT NULL IDENTITY(1,1),
    [person_id] INT NOT NULL,
    [company_name] VARCHAR(200),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__suppliers__state__05D8E0BE] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__suppliers__creat__06CD04F7] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__suppliers__updat__07C12930] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__supplier__6EE594E802C79B0D] PRIMARY KEY CLUSTERED ([supplier_id]),
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
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__users__state__0F624AF8] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__users__created_a__10566F31] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__users__updated_a__114A936A] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__users__B9BE370F90891B10] PRIMARY KEY CLUSTERED ([user_id]),
    CONSTRAINT [UK_user_person] UNIQUE NONCLUSTERED ([person_id]),
    CONSTRAINT [UQ__users__F3DBC5726FDF2BF7] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[vehicle_document_types] (
    [document_type_id] INT NOT NULL IDENTITY(1,1),
    [type_name] VARCHAR(100) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__vehicle_d__state__078C1F06] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_d__creat__0880433F] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_d__updat__09746778] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__vehicle___69F7C2B13C577FBC] PRIMARY KEY CLUSTERED ([document_type_id])
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
    [is_valid] BIT NOT NULL CONSTRAINT [DF__vehicle_d__is_va__0D44F85C] DEFAULT 1,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__vehicle_d__state__0E391C95] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_d__creat__0F2D40CE] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_d__updat__10216507] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__vehicle___8C5AE532D0650653] PRIMARY KEY CLUSTERED ([vehicle_document_id])
);

-- CreateTable
CREATE TABLE [dbo].[vehicle_statuses] (
    [vehicle_status_id] INT NOT NULL IDENTITY(1,1),
    [status_name] VARCHAR(50) NOT NULL,
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__vehicle_s__state__756D6ECB] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_s__creat__76619304] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_s__updat__7755B73D] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__vehicle___E8592AD2E394C7C4] PRIMARY KEY CLUSTERED ([vehicle_status_id])
);

-- CreateTable
CREATE TABLE [dbo].[vehicle_types] (
    [vehicle_type_id] INT NOT NULL IDENTITY(1,1),
    [type_name] VARCHAR(100) NOT NULL,
    [description] VARCHAR(500),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__vehicle_t__state__6FB49575] DEFAULT 'A',
    [load_capacity_kg] DECIMAL(10,2) NOT NULL,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_t__creat__70A8B9AE] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__vehicle_t__updat__719CDDE7] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__vehicle___2A0072181766BB0E] PRIMARY KEY CLUSTERED ([vehicle_type_id])
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
    [current_mileage] INT NOT NULL CONSTRAINT [DF__vehicles__curren__7E02B4CC] DEFAULT 0,
    [load_capacity_kg] DECIMAL(10,2) NOT NULL,
    [vehicle_status_id] INT NOT NULL,
    [supplier_id] INT,
    [purchase_date] DATE,
    [purchase_price] DECIMAL(12,2),
    [state] VARCHAR(1) NOT NULL CONSTRAINT [DF__vehicles__state__7EF6D905] DEFAULT 'A',
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__vehicles__create__7FEAFD3E] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__vehicles__update__00DF2177] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__vehicles__F2947BC1B76D4EC4] PRIMARY KEY CLUSTERED ([vehicle_id]),
    CONSTRAINT [UQ__vehicles__F72CD56E12015FC6] UNIQUE NONCLUSTERED ([license_plate]),
    CONSTRAINT [UQ__vehicles__DDB00C660FEDE02A] UNIQUE NONCLUSTERED ([vin])
);

-- AddForeignKey
ALTER TABLE [dbo].[addresses] ADD CONSTRAINT [FK__addresses__party__02084FDA] FOREIGN KEY ([party_id]) REFERENCES [dbo].[parties]([party_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[addresses] ADD CONSTRAINT [FK__addresses__state__02FC7413] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[categories] ADD CONSTRAINT [FK__categorie__state__47DBAE45] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[colors] ADD CONSTRAINT [FK__colors__state__4222D4EF] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[completed_maintenance] ADD CONSTRAINT [FK__completed__maint__2DB1C7EE] FOREIGN KEY ([maintenance_type_id]) REFERENCES [dbo].[maintenance_types]([maintenance_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[completed_maintenance] ADD CONSTRAINT [FK__completed__sched__2BC97F7C] FOREIGN KEY ([scheduled_maintenance_id]) REFERENCES [dbo].[scheduled_maintenance]([scheduled_maintenance_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[completed_maintenance] ADD CONSTRAINT [FK__completed__state__2F9A1060] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[completed_maintenance] ADD CONSTRAINT [FK__completed__suppl__2EA5EC27] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[suppliers]([supplier_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[completed_maintenance] ADD CONSTRAINT [FK__completed__vehic__2CBDA3B5] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]([vehicle_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[customers] ADD CONSTRAINT [FK__customers__user___19DFD96B] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[deliveries] ADD CONSTRAINT [FK__deliverie__custo__5B78929E] FOREIGN KEY ([customer_id]) REFERENCES [dbo].[customers]([customer_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[deliveries] ADD CONSTRAINT [FK__deliverie__order__5A846E65] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([order_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[deliveries] ADD CONSTRAINT [FK__deliverie__shipm__59904A2C] FOREIGN KEY ([shipment_id]) REFERENCES [dbo].[shipments]([shipment_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[deliveries] ADD CONSTRAINT [FK__deliverie__state__5C6CB6D7] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[departments] ADD CONSTRAINT [FK__departmen__state__4D94879B] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[document_types] ADD CONSTRAINT [FK__document___state__2B3F6F97] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[employees] ADD CONSTRAINT [FK__employees__depar__208CD6FA] FOREIGN KEY ([department_id]) REFERENCES [dbo].[departments]([department_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[employees] ADD CONSTRAINT [FK__employees__user___1F98B2C1] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fuel_logs] ADD CONSTRAINT [FK__fuel_logs__drive__40C49C62] FOREIGN KEY ([driver_id]) REFERENCES [dbo].[employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fuel_logs] ADD CONSTRAINT [FK__fuel_logs__state__41B8C09B] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[fuel_logs] ADD CONSTRAINT [FK__fuel_logs__vehic__3FD07829] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]([vehicle_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[inventory_movements] ADD CONSTRAINT [FK__inventory__creat__47A6A41B] FOREIGN KEY ([created_by]) REFERENCES [dbo].[employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[inventory_movements] ADD CONSTRAINT [FK__inventory__movem__46B27FE2] FOREIGN KEY ([movement]) REFERENCES [dbo].[movement_types]([movement]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[inventory_movements] ADD CONSTRAINT [FK__inventory__state__489AC854] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[inventory_movements] ADD CONSTRAINT [FK__inventory__varia__45BE5BA9] FOREIGN KEY ([variant_id]) REFERENCES [dbo].[product_variants]([variant_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[maintenance_parts] ADD CONSTRAINT [FK__maintenan__compl__373B3228] FOREIGN KEY ([completed_maintenance_id]) REFERENCES [dbo].[completed_maintenance]([completed_maintenance_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[maintenance_parts] ADD CONSTRAINT [FK__maintenan__state__39237A9A] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[maintenance_parts] ADD CONSTRAINT [FK__maintenan__suppl__382F5661] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[suppliers]([supplier_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[maintenance_statuses] ADD CONSTRAINT [FK__maintenan__state__1A9EF37A] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[maintenance_types] ADD CONSTRAINT [FK__maintenan__state__14E61A24] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[movement_types] ADD CONSTRAINT [FK__movement___state__534D60F1] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[order_items] ADD CONSTRAINT [FK__order_ite__order__5CA1C101] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([order_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[order_items] ADD CONSTRAINT [FK__order_ite__varia__5D95E53A] FOREIGN KEY ([variant_id]) REFERENCES [dbo].[product_variants]([variant_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[order_statuses] ADD CONSTRAINT [FK__order_sta__state__59063A47] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [FK__orders__customer__531856C7] FOREIGN KEY ([customer_id]) REFERENCES [dbo].[customers]([customer_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [FK__orders__order_st__55009F39] FOREIGN KEY ([order_status_id]) REFERENCES [dbo].[order_statuses]([order_status_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [FK__orders__shipping__540C7B00] FOREIGN KEY ([shipping_address_id]) REFERENCES [dbo].[addresses]([address_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [FK__orders__state__55F4C372] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[parties] ADD CONSTRAINT [FK__parties__state__6B24EA82] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[payment_methods] ADD CONSTRAINT [FK__payment_m__state__5EBF139D] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[payments] ADD CONSTRAINT [FK__payments__order___671F4F74] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([order_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[payments] ADD CONSTRAINT [FK__payments__paymen__681373AD] FOREIGN KEY ([payment_method_id]) REFERENCES [dbo].[payment_methods]([payment_method_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[payments] ADD CONSTRAINT [FK__payments__state__690797E6] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[persons] ADD CONSTRAINT [FK__persons__documen__71D1E811] FOREIGN KEY ([document_type_id]) REFERENCES [dbo].[document_types]([document_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[persons] ADD CONSTRAINT [FK__persons__person___70DDC3D8] FOREIGN KEY ([person_id]) REFERENCES [dbo].[parties]([party_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[phone_types] ADD CONSTRAINT [FK__phone_typ__state__30F848ED] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[phones] ADD CONSTRAINT [FK__phones__party_id__797309D9] FOREIGN KEY ([party_id]) REFERENCES [dbo].[parties]([party_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[phones] ADD CONSTRAINT [FK__phones__person_i__787EE5A0] FOREIGN KEY ([person_id]) REFERENCES [dbo].[persons]([person_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[phones] ADD CONSTRAINT [FK__phones__phone_ty__7A672E12] FOREIGN KEY ([phone_type_id]) REFERENCES [dbo].[phone_types]([phone_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[phones] ADD CONSTRAINT [FK__phones__state__7B5B524B] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_images] ADD CONSTRAINT [FK__product_i__produ__3E1D39E1] FOREIGN KEY ([product_id]) REFERENCES [dbo].[products]([product_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_images] ADD CONSTRAINT [FK__product_i__state__3F115E1A] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_variants] ADD CONSTRAINT [FK__product_v__color__3587F3E0] FOREIGN KEY ([color_id]) REFERENCES [dbo].[colors]([color_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_variants] ADD CONSTRAINT [FK__product_v__produ__3493CFA7] FOREIGN KEY ([product_id]) REFERENCES [dbo].[products]([product_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_variants] ADD CONSTRAINT [FK__product_v__size___367C1819] FOREIGN KEY ([size_code]) REFERENCES [dbo].[sizes]([size_code]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[product_variants] ADD CONSTRAINT [FK__product_v__state__37703C52] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[products] ADD CONSTRAINT [FK__products__catego__29221CFB] FOREIGN KEY ([category_id]) REFERENCES [dbo].[categories]([category_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[products] ADD CONSTRAINT [FK__products__state__2A164134] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[roles] ADD CONSTRAINT [FK__roles__state__36B12243] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduled_maintenance] ADD CONSTRAINT [FK__scheduled__maint__214BF109] FOREIGN KEY ([maintenance_type_id]) REFERENCES [dbo].[maintenance_types]([maintenance_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduled_maintenance] ADD CONSTRAINT [FK__scheduled__maint__2334397B] FOREIGN KEY ([maintenance_status_id]) REFERENCES [dbo].[maintenance_statuses]([maintenance_status_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduled_maintenance] ADD CONSTRAINT [FK__scheduled__state__24285DB4] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduled_maintenance] ADD CONSTRAINT [FK__scheduled__suppl__22401542] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[suppliers]([supplier_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduled_maintenance] ADD CONSTRAINT [FK__scheduled__vehic__2057CCD0] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]([vehicle_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipment_orders] ADD CONSTRAINT [FK__shipment___order__52E34C9D] FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([order_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipment_orders] ADD CONSTRAINT [FK__shipment___shipm__51EF2864] FOREIGN KEY ([shipment_id]) REFERENCES [dbo].[shipments]([shipment_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [FK__shipments__drive__4A4E069C] FOREIGN KEY ([driver_id]) REFERENCES [dbo].[employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [FK__shipments__state__4C364F0E] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [FK__shipments__statu__4B422AD5] FOREIGN KEY ([status_code]) REFERENCES [dbo].[shipping_statuses]([status_code]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [FK__shipments__vehic__4959E263] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]([vehicle_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipping_statuses] ADD CONSTRAINT [FK__shipping___state__6477ECF3] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[sizes] ADD CONSTRAINT [FK__sizes__state__3C69FB99] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[suppliers] ADD CONSTRAINT [FK__suppliers__perso__08B54D69] FOREIGN KEY ([person_id]) REFERENCES [dbo].[persons]([person_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[suppliers] ADD CONSTRAINT [FK__suppliers__state__09A971A2] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [FK__users__person_id__10566F31] FOREIGN KEY ([person_id]) REFERENCES [dbo].[persons]([person_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [FK__users__role_id__114A936A] FOREIGN KEY ([role_id]) REFERENCES [dbo].[roles]([role_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [FK__users__state__123EB7A3] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_document_types] ADD CONSTRAINT [FK__vehicle_d__state__0697FACD] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_documents] ADD CONSTRAINT [FK__vehicle_d__docum__0E391C95] FOREIGN KEY ([document_type_id]) REFERENCES [dbo].[vehicle_document_types]([document_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_documents] ADD CONSTRAINT [FK__vehicle_d__state__0F2D40CE] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_documents] ADD CONSTRAINT [FK__vehicle_d__vehic__0D44F85C] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]([vehicle_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_statuses] ADD CONSTRAINT [FK__vehicle_s__state__74794A92] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_types] ADD CONSTRAINT [FK__vehicle_t__state__6EC0713C] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicles] ADD CONSTRAINT [FK__vehicles__state__00DF2177] FOREIGN KEY ([state]) REFERENCES [dbo].[states]([state]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicles] ADD CONSTRAINT [FK__vehicles__suppli__7FEAFD3E] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[suppliers]([supplier_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicles] ADD CONSTRAINT [FK__vehicles__vehicl__7E02B4CC] FOREIGN KEY ([vehicle_type_id]) REFERENCES [dbo].[vehicle_types]([vehicle_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicles] ADD CONSTRAINT [FK__vehicles__vehicl__7EF6D905] FOREIGN KEY ([vehicle_status_id]) REFERENCES [dbo].[vehicle_statuses]([vehicle_status_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
