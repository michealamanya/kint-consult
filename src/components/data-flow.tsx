const stages = [
  { number: "01", title: "Data", copy: "Gather relevant sources." },
  { number: "02", title: "Structure", copy: "Connect and organise." },
  { number: "03", title: "Intelligence", copy: "Find meaning and context." },
  { number: "04", title: "AI", copy: "Assist analysis and discovery." },
  { number: "05", title: "Decisions", copy: "Inform the next action." },
];
export function DataFlow() {
  return (
    <ol className="data-flow" aria-label="From data to decisions">
      {stages.map((stage) => (
        <li key={stage.number}>
          <span className="flow-number">{stage.number}</span>
          <div className="flow-node" aria-hidden="true">
            <span />
          </div>
          <h3>{stage.title}</h3>
          <p>{stage.copy}</p>
        </li>
      ))}
    </ol>
  );
}
