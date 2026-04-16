# Database Execution Log

## All Database Commands Executed

### Date: April 9-10, 2026
### Database: pepene_de_dabuleni
### DBMS: PostgreSQL 16 with PostGIS

---

## 1. Create Database and Enable Extensions

```sql
CREATE DATABASE pepene_de_dabuleni;

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
```

**Execution Command:**
```powershell
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE pepene_de_dabuleni;"
```

---

## 2. Create Producers Table

```sql
CREATE TABLE IF NOT EXISTS producers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Execution Command:**
```powershell
docker-compose exec postgres psql -U postgres -d pepene_de_dabuleni -c "
CREATE TABLE IF NOT EXISTS producers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);"
```

---

## 3. Create Spatial Index on Location

```sql
CREATE INDEX IF NOT EXISTS idx_producers_location ON producers USING GIST (location);
```

**Execution Command:**
```powershell
docker-compose exec postgres psql -U postgres -d pepene_de_dabuleni -c "
CREATE INDEX IF NOT EXISTS idx_producers_location ON producers USING GIST (location);"
```

---

## 4. Insert Test Data

```sql
INSERT INTO producers (name, product, location)
VALUES ('Gita', 'Sorento', ST_SetSRID(ST_MakePoint(21.2272, 45.7494), 4326));
```

**Execution Command:**
```powershell
docker-compose exec postgres psql -U postgres -d pepene_de_dabuleni -c "
INSERT INTO producers (name, product, location)
VALUES ('Gita', 'Sorento', ST_SetSRID(ST_MakePoint(21.2272, 45.7494), 4326));"
```

---
