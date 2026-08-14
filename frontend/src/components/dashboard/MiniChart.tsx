"use client";

import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", value: 20 },
  { time: "01:00", value: 35 },
  { time: "02:00", value: 55 },
  { time: "03:00", value: 40 },
  { time: "04:00", value: 70 },
  { time: "05:00", value: 45 },
  { time: "06:00", value: 80 },
  { time: "07:00", value: 60 },
  { time: "08:00", value: 90 },
  { time: "09:00", value: 50 },
  { time: "10:00", value: 30 },
  { time: "11:00", value: 65 },
  { time: "12:00", value: 75 },
  { time: "13:00", value: 40 },
  { time: "14:00", value: 25 },
  { time: "15:00", value: 55 },
  { time: "16:00", value: 85 },
  { time: "17:00", value: 70 },
  { time: "18:00", value: 60 },
  { time: "19:00", value: 45 },
  { time: "20:00", value: 35 },
  { time: "21:00", value: 50 },
  { time: "22:00", value: 65 },
  { time: "23:00", value: 40 },
];

export default function MiniChart() {
  return (
    <div>
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis dataKey="time" hide />
            <Bar dataKey="value" fill="#4f8cff" radius={[3, 3, 0, 0]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-muted font-mono">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>Now</span>
      </div>
    </div>
  );
}
