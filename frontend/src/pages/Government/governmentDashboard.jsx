import React, { useEffect, useState } from "react";
import Header from "../../components/Government/Header";
import Footer from "../../components/Government/Footer";

const API_URL =
  import.meta.env.VITE_GOVERNMENT_DASHBOARD_API_URL ||
  "/api/dashboard/government";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatNumber = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value);
  }

  return value;
};

const getArray = (value) => {
  return Array.isArray(value) ? value : [];
};

/* -------------------------------------------------------------------------- */
/* Reusable Components                                                        */
/* -------------------------------------------------------------------------- */

const Section = ({ title, children }) => {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between rounded-[10px] bg-[#5EC0D0] px-4 py-3 shadow-sm">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#123047]">
          {title}
        </h2>

        <button
          type="button"
          className="rounded-[5px] bg-[#087DE7] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#066CC8]"
        >
          See more
        </button>
      </div>

      {children}
    </section>
  );
};

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-[18px] border border-[#D5E8F0] bg-gradient-to-b from-white to-[#DCF1F9] shadow-[0_3px_8px_rgba(50,100,120,.12)] ${className}`}
    >
      {children}
    </div>
  );
};

const StatCard = ({ icon, value, label, sub }) => {
  return (
    <Card className="flex items-center gap-4 px-5 py-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] bg-[#E6F3F8] text-[23px]">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-[24px] font-bold leading-none tracking-[-0.03em] text-[#132C45]">
          {value}
        </div>

        <div className="mt-1.5 text-[11px] font-medium leading-tight text-[#294158]">
          {label}
        </div>

        {sub && (
          <div className="mt-1 text-[10px] leading-tight text-[#758593]">
            {sub}
          </div>
        )}
      </div>
    </Card>
  );
};

const CardTitle = ({ children }) => {
  return (
    <h3 className="text-center text-[12px] font-semibold leading-tight tracking-[-0.01em] text-[#20384E]">
      {children}
    </h3>
  );
};

const SmallText = ({ children, className = "" }) => {
  return (
    <p
      className={`text-[10px] leading-[1.4] text-[#6D7F8E] ${className}`}
    >
      {children}
    </p>
  );
};

const Legend = ({ items }) => {
  return (
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <div
          key={item.label || index}
          className="flex items-center gap-2 text-[10px] leading-tight text-[#354A5D]"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{
              background: item.color || "#3B82F6",
            }}
          />

          <span>{item.label || "Unknown"}</span>
        </div>
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Charts                                                                     */
/* -------------------------------------------------------------------------- */

const Donut = ({ data, size = 120 }) => {
  const safeData = getArray(data).filter(
    (item) => typeof item.value === "number"
  );

  const total = safeData.reduce((sum, item) => {
    return sum + item.value;
  }, 0);

  if (!total) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-[#DCEBF0] text-[10px] text-[#758593]"
        style={{
          width: size,
          height: size,
        }}
      >
        No data
      </div>
    );
  }

  let current = 0;

  const gradient = safeData
    .map((item) => {
      const start = (current / total) * 100;

      current += item.value;

      const end = (current / total) * 100;

      return `${item.color || "#3B82F6"} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div
      className="relative shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${gradient})`,
      }}
    >
      <div className="absolute inset-[27px] flex items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#173149]">
        {total}%
      </div>
    </div>
  );
};

const BarChart = ({ data, height = 120 }) => {
  const safeData = getArray(data).filter(
    (item) => typeof item.value === "number"
  );

  if (safeData.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-[10px] text-[#758593]"
        style={{ height }}
      >
        No data
      </div>
    );
  }

  const max = Math.max(
    ...safeData.map((item) => item.value),
    1
  );

  return (
    <div
      className="flex items-end justify-between gap-3"
      style={{ height }}
    >
      {safeData.map((item, index) => (
        <div
          key={item.label || index}
          className="flex h-full flex-1 flex-col items-center justify-end"
        >
          <div
            className="w-7 rounded-t-[4px]"
            style={{
              height: `${Math.max(
                (item.value / max) * 90,
                5
              )}%`,
              background: item.color || "#3B82F6",
            }}
          />

          <span className="mt-2 max-w-[70px] truncate text-center text-[9px] leading-tight text-[#65798A]">
            {item.label || "Unknown"}
          </span>
        </div>
      ))}
    </div>
  );
};

const Progress = ({ data }) => {
  const safeData = getArray(data).filter(
    (item) => typeof item.value === "number"
  );

  if (safeData.length === 0) {
    return (
      <p className="text-center text-[10px] text-[#758593]">
        No data
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {safeData.map((item, index) => (
        <div
          key={item.label || index}
          className="grid grid-cols-[90px_1fr_32px_24px] items-center gap-2"
        >
          <span className="truncate text-[10px] leading-tight text-[#3B5062]">
            {item.label || "Unknown"}
          </span>

          <div className="h-[8px] overflow-hidden rounded-full bg-[#D3E8EF]">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(item.value, 100)
                )}%`,
                background: item.color || "#3B82F6",
              }}
            />
          </div>

          <span className="text-right text-[10px] font-semibold text-[#52697B]">
            {item.value}%
          </span>

          <span className="text-center text-sm">
            {item.icon || ""}
          </span>
        </div>
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Main Dashboard                                                             */
/* -------------------------------------------------------------------------- */

export default function GovernmentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Dashboard request failed with status ${response.status}`
          );
        }

        const result = await response.json();

        /*
         * Your backend can return either:
         *
         * {
         *   data: { ... }
         * }
         *
         * OR directly:
         *
         * {
         *   hero: { ... },
         *   touristStatistics: { ... }
         * }
         *
         * This supports both.
         */
        const dashboardData = result?.data ?? result;

        if (!dashboardData || typeof dashboardData !== "object") {
          throw new Error(
            "The server returned invalid dashboard data."
          );
        }

        setData(dashboardData);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error(
          "Government dashboard error:",
          err
        );

        setError(
          err.message ||
            "Unable to load government dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      controller.abort();
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAF7FC] font-sans text-[#20384E]">
        <Header />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm font-medium text-[#526A7B]">
            Loading dashboard...
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-[#EAF7FC] font-sans text-[#20384E]">
        <Header />

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-red-600">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-[#526A7B]">
              {error}
            </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* No Data                                                                */
  /* ---------------------------------------------------------------------- */

  if (!data) {
    return (
      <div className="min-h-screen bg-[#EAF7FC] font-sans text-[#20384E]">
        <Header />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm font-medium text-[#526A7B]">
            No dashboard data available.
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Data from MongoDB document                                             */
  /* ---------------------------------------------------------------------- */

  const stats = data.touristStatistics || {};
  const revenue = data.revenueStatistics || {};
  const behavior = data.touristBehavior || {};
  const emergency = data.emergency || {};

  const demographics = getArray(stats.demographics);
  const countries = getArray(stats.countries);

  const travelModes = getArray(behavior.travelModes);
  const foodCategories = getArray(
    behavior.foodCategories
  );

  const complaints = getArray(
    emergency.complaints
  );

  const revenueCategories = getArray(
    revenue.categories
  );

  const heroTitle =
    data.hero?.title || "Government Dashboard";

  const heroImage =
    data.hero?.background || DEFAULT_HERO_IMAGE;

  /* ---------------------------------------------------------------------- */
  /* Page                                                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#EAF7FC] font-sans text-[#20384E]">
      <Header />

      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section
        className="relative h-[330px] overflow-hidden bg-cover bg-center md:h-[370px]"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(0, 38, 58, 0.48) 0%,
              rgba(0, 38, 58, 0.24) 45%,
              rgba(0, 38, 58, 0.10) 100%
            ),
            url("${heroImage}")
          `,
        }}
      >
        <div className="relative z-10 mx-auto flex h-full max-w-[1240px] items-end px-5 pb-8">
          <h1 className="max-w-[650px] font-serif text-[42px] font-semibold italic leading-[1.08] tracking-[-0.03em] text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.4)] md:text-[58px]">
            {heroTitle}
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-[1240px] space-y-9 px-4 py-8 md:px-6">
        {/* ---------------------------------------------------------------- */}
        {/* Tourist Statistics                                               */}
        {/* ---------------------------------------------------------------- */}

        <Section title="Tourist Statistics">
          <div className="grid gap-5 md:grid-cols-[.7fr_1fr_1fr]">
            <div className="space-y-5">
              <StatCard
                icon="🧭"
                value={`${formatNumber(
                  stats.liveTourists
                )}+`}
                label="Live Tourist Count"
              />

              <StatCard
                icon="📍"
                value={`${formatNumber(
                  stats.arrivals
                )}+`}
                label="Arrival Trends"
                sub={
                  stats.arrivals != null
                    ? `Arrive ${formatNumber(
                        stats.arrivals
                      )} people per month`
                    : null
                }
              />
            </div>

            <Card className="p-5">
              <CardTitle>
                Age & Gender Demographics
              </CardTitle>

              <div className="mt-5 flex items-center justify-center gap-6">
                <Donut data={demographics} />

                <Legend items={demographics} />
              </div>
            </Card>

            <Card className="p-5">
              <CardTitle>
                Most Visited Countries near Sri Lanka
              </CardTitle>

              <div className="mt-4">
                <BarChart data={countries} />
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {countries.map((item, index) => (
                  <div
                    key={item.label || index}
                    className="flex items-center gap-1.5 text-[9px] text-[#53697A]"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        background:
                          item.color || "#3B82F6",
                      }}
                    />

                    {item.label || "Unknown"}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Revenue Statistics                                               */}
        {/* ---------------------------------------------------------------- */}

        <Section title="Revenue Statistics">
          <Card className="mx-auto max-w-[720px] p-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <div>
                <SmallText>
                  Total Revenue
                </SmallText>

                <h2 className="mt-1 text-[26px] font-bold leading-none tracking-[-0.03em] text-[#132C45]">
                  {revenue.totalRevenue || "—"}
                </h2>

                <SmallText className="mt-2">
                  {revenue.revenueChange || ""}
                </SmallText>
              </div>

              <div className="flex gap-8">
                <div>
                  <SmallText>
                    Last month
                  </SmallText>

                  <p className="mt-1 text-[16px] font-semibold text-[#294158]">
                    {revenue.lastMonthGrowth ??
                      "—"}
                    %
                    <span className="ml-1">
                      📉
                    </span>
                  </p>
                </div>

                <div>
                  <SmallText>
                    This month
                  </SmallText>

                  <p className="mt-1 text-[16px] font-semibold text-[#294158]">
                    {revenue.thisMonthGrowth ??
                      "—"}
                    %
                    <span className="ml-1">
                      📈
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {revenueCategories.map(
                (item, index) => (
                  <div
                    key={item.label || index}
                    className="rounded-xl p-5 text-center text-white shadow-sm"
                    style={{
                      background:
                        item.color || "#0EA5A4",
                    }}
                  >
                    <p className="text-[10px] font-medium">
                      {item.label || "Unknown"}
                    </p>

                    <h3 className="mt-3 text-[20px] font-bold leading-none">
                      {item.value ?? "—"}
                    </h3>

                    <p className="mt-2 text-[10px] font-medium">
                      {item.change || ""}
                    </p>
                  </div>
                )
              )}
            </div>
          </Card>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Tourist Behavior                                                 */}
        {/* ---------------------------------------------------------------- */}

        <Section title="Tourist Behavior & Preferences">
          <Card className="mx-auto max-w-[560px] p-6">
            <CardTitle>
              Most Used Travel Modes
            </CardTitle>

            <div className="mt-6">
              <Progress data={travelModes} />
            </div>
          </Card>

          <div className="mx-auto grid max-w-[800px] gap-5 md:grid-cols-2">
            <Card className="p-5">
              <CardTitle>
                Most Profited Food Categories
              </CardTitle>

              <div className="mt-4">
                <BarChart
                  data={foodCategories}
                />
              </div>
            </Card>

            <Card className="p-6">
              <CardTitle>
                Current Satisfaction of Sri Lanka
              </CardTitle>

              <div className="mt-6 flex items-center justify-around text-center">
                <div>
                  <div className="text-[27px] font-bold leading-none tracking-[-0.03em] text-[#132C45]">
                    {behavior.satisfaction
                      ?.current ?? "—"}

                    {behavior.satisfaction
                      ?.current != null
                      ? "/10"
                      : ""}
                  </div>

                  <SmallText className="mt-2">
                    This Year
                  </SmallText>
                </div>

                <div className="text-xl font-light text-[#708291]">
                  ⇅
                </div>

                <div>
                  <div className="text-[27px] font-bold leading-none tracking-[-0.03em] text-[#132C45]">
                    {behavior.satisfaction
                      ?.previous ?? "—"}

                    {behavior.satisfaction
                      ?.previous != null
                      ? "/10"
                      : ""}
                  </div>

                  <SmallText className="mt-2">
                    Last Year
                  </SmallText>
                </div>
              </div>

              <p className="mt-6 text-center text-[10px] font-medium text-[#2CA5B7]">
                {behavior.satisfaction
                  ?.weeklyChange != null
                  ? `+${behavior.satisfaction.weeklyChange}% from last week`
                  : "—"}
              </p>
            </Card>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Emergency Response                                               */}
        {/* ---------------------------------------------------------------- */}

        <Section title="Emergency Response">
          <div className="mx-auto grid max-w-[800px] gap-5 md:grid-cols-2">
            <Card className="p-5">
              <CardTitle>
                Tourist Complaints
              </CardTitle>

              <div className="mt-6 flex items-center justify-center gap-7">
                <Donut data={complaints} />

                <Legend items={complaints} />
              </div>
            </Card>

            <Card className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center">
              <div className="text-[38px] leading-none">
                🛡️
              </div>

              <div className="mt-3 text-[38px] font-bold leading-none tracking-[-0.03em] text-[#132C45]">
                {formatNumber(
                  emergency.safetyIncidents?.total
                )}
              </div>

              <p className="mt-3 text-[11px] font-medium text-[#3B5062]">
                Total Safety Incidents This Month
              </p>

              <SmallText className="mt-2">
                {emergency.safetyIncidents
                  ?.change || ""}
              </SmallText>
            </Card>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}