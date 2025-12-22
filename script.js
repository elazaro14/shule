body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  display: flex;
  height: 100vh;
  background: #f4f7f9;
}

.sidebar {
  width: 220px;
  background: #2c3e50;
  color: #fff;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar h2 {
  text-align: center;
  margin-bottom: 30px;
}

.sidebar ul {
  list-style: none;
  padding-left: 0;
}

.sidebar ul li {
  padding: 15px 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: 0.3s;
}

.sidebar ul li:hover {
  background: #34495e;
}

.main {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.card {
  background: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.login-card {
  max-width: 400px;
  margin: 50px auto;
}

input, select, button {
  padding: 8px 10px;
  margin: 5px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  background: #2980b9;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #3498db;
}

h2, h3 {
  color: #2c3e50;
}

.form-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.section {
  margin-bottom: 30px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table th, .table td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: left;
}

.table th {
  background: #2980b9;
  color: white;
}

.table tbody tr:nth-child(even) {
  background: #f4f7f9;
}

/* Dashboard Summary Cards */
.cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.card-summary {
  flex: 1 1 200px;
  background: #3498db;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.card-summary h3 {
  margin-bottom: 10px;
}
