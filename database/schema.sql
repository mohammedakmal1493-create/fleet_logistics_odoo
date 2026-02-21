CREATE DATABASE fleetflow;
\c fleetflow;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Driver'))
);

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    model VARCHAR(255) NOT NULL,
    license_plate VARCHAR(100) UNIQUE NOT NULL,
    capacity NUMERIC NOT NULL,
    odometer NUMERIC DEFAULT 0,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Available', 'On Trip', 'In Shop', 'Retired')),
    acquisition_cost NUMERIC DEFAULT 0
);

CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('On Duty', 'Off Duty', 'Suspended', 'On Trip')),
    safety_score NUMERIC DEFAULT 100
);

CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(id),
    driver_id INT REFERENCES drivers(id),
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    cargo_weight NUMERIC NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Dispatched', 'Completed', 'Cancelled'))
);

CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(id),
    description TEXT,
    cost NUMERIC NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE fuel_logs (
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(id),
    liters NUMERIC NOT NULL,
    cost NUMERIC NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(id),
    type VARCHAR(100) NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE NOT NULL
);
