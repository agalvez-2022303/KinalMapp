export default function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 375,
        height: 812,
        backgroundColor: "#F8F9FB",
        borderRadius: 30,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  )
}
