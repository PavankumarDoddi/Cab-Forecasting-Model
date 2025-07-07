import React, { useState, useMemo } from "react";
import styles from "./AllocationGrid.module.css";
import {
  Search,
  Filter,
  Car,
  Download,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function AllocationGrid({
  employeeData = [],
  shiftTimings = [],
  onAllocate,
}) {
  // alias for clarity
  const data = employeeData;

  /* ——— State & Filters ——— */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShift, setSelectedShift] = useState("all");

  /* ——— Build shift dropdown from shiftTimings (or fall back to data) ——— */
  const shiftOptions = useMemo(() => {
    if (shiftTimings.length) {
      return [
        "all",
        ...shiftTimings.map((s) =>
          s.shift_name
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        ),
      ];
    }
    const uniq = Array.from(new Set(data.map((d) => d.shift)));
    return ["all", ...uniq];
  }, [data, shiftTimings]);

  /* ——— Filtered rows ——— */
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.filter((emp) => {
      const matchesSearch =
        emp.employee_id.toLowerCase().includes(term) ||
        (emp.cab_id || "").toLowerCase().includes(term);
      const matchesShift =
        selectedShift === "all" ||
        emp.shift.toLowerCase() === selectedShift.toLowerCase();
      return matchesSearch && matchesShift;
    });
  }, [data, searchTerm, selectedShift]);

  /* ——— Summary stats ——— */
  const stats = useMemo(() => {
    const totalEmployees = data.length;
    const activeCabs = new Set(data.map((e) => e.cab_id)).size;
    const shiftCounts = data.reduce((acc, curr) => {
      acc[curr.shift] = (acc[curr.shift] || 0) + 1;
      return acc;
    }, {});
    return { totalEmployees, activeCabs, shiftCounts };
  }, [data]);

  /* ——— Cab‐by‐cab summary ——— */
  const summary = useMemo(() => {
    return filteredData.reduce((acc, curr) => {
      if (!acc[curr.cab_id])
        acc[curr.cab_id] = { count: 0, type: curr.cab_type || "—" };
      acc[curr.cab_id].count++;
      return acc;
    }, {});
  }, [filteredData]);

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>CAB Allocation Dashboard</h1>
          <p className={styles.subtitle}>
            Smart transportation management system
          </p>
        </div>
        <div className={styles.actions}>
          {/* Allocate button, styled like Export/Schedule */}
          <button
            className={`${styles.button} ${styles.allocateBtn}`}
            onClick={onAllocate}
          >
            <Activity size={16} /> Allocate Cab
          </button>
          <button className={`${styles.button} ${styles.exportBtn}`}>
            <Download size={16} /> Export Data
          </button>
          <button className={`${styles.button} ${styles.scheduleBtn}`}>
            <Calendar size={16} /> Schedule
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className={styles.searchFilter}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by employee or cab…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterSelect}>
          <Filter size={18} />
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
          >
            {shiftOptions.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Shifts" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Employees</h3>
          <div className={styles.statValue}>{stats.totalEmployees}</div>
          <div className={styles.statMeta}>
            <TrendingUp size={14} /> +12% from last month
          </div>
        </div>
        <div className={styles.statCard}>
          <h3>Active Cabs</h3>
          <div className={styles.statValue}>{stats.activeCabs}</div>
          <div className={styles.statMeta}>
            <Car size={14} /> All operational
          </div>
        </div>
      </div>

      {/* CAB SUMMARY TABLE */}
      <div className={styles.summaryTable}>
        <table>
          <thead>
            <tr>
              <th>Cab No.</th>
              <th># Emp</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary).map(([cab, info]) => (
              <tr key={cab}>
                <td>{cab}</td>
                <td>{info.count}</td>
                <td>{info.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SHIFT‐BY‐SHIFT GRID */}
      <div className={styles.grid}>
        {Object.entries(stats.shiftCounts).map(([shift, count]) => (
          <div key={shift} className={styles.card}>
            <h4>{shift}</h4>
            <div className={styles.count}>{count}</div>
            <div className={styles.note}>Peak hours</div>
          </div>
        ))}
      </div>
    </div>
  );
}
