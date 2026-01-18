const LighthouseEffect = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `
          radial-gradient(ellipse at 30% 50%, rgba(36, 99, 235, 0.04) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 80%, rgba(36, 99, 235, 0.03) 0%, transparent 60%),
          radial-gradient(ellipse at 50% 20%, rgba(36, 99, 235, 0.025) 0%, transparent 60%),
          radial-gradient(ellipse at 10% 70%, rgba(36, 99, 235, 0.02) 0%, transparent 50%),
          radial-gradient(ellipse at 90% 30%, rgba(36, 99, 235, 0.02) 0%, transparent 50%)
        `,
        mixBlendMode: "normal",
        opacity: 1,
      }}
    />
  );
};

export default LighthouseEffect;

