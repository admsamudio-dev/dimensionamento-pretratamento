function calcular() {
  const aut = +document.getElementById("autoclave").value;
  const ter = +document.getElementById("termodes").value;
  const ped = +document.getElementById("pedal").value;
  const sem = +document.getElementById("sempedal").value;
  const ccih = +document.getElementById("ccih").value;
  const maq = +document.getElementById("maquinas").value;
  const condStr = document.getElementById("cond").value;
  const cond = condStr === "" ? null : +condStr;

  // Consumos em L/h
  const qBase =
    (aut * 30) +
    (ter * 130) +
    (ped * 200) +
    (sem * 300) +
    (ccih * 360) +
    (maq * 30);

  const margem = 1.25;
  const qSeg = qBase * margem;

  // Fator por condutividade (opcional)
  let fator = 1.0;
  if (cond !== null && !Number.isNaN(cond)) {
    if (cond <= 300) fator = 1.0;
    else if (cond <= 800) fator = 1.10;
    else if (cond <= 1500) fator = 1.20;
    else fator = 1.30;
  }

  const qFinal = qSeg * fator;

  // Dimensionamento (L/h)
  let dim;
  if (qFinal <= 500) dim = 500;
  else if (qFinal <= 750) dim = 750;
  else if (qFinal <= 1000) dim = 1000;
  else if (qFinal <= 1250) dim = 1250;
  else if (qFinal <= 3000) dim = 3000;
  else dim = "ACIMA_3000";

  // Bomba
  let bombaTexto = "Mini Central";
  const m3h = qFinal / 1000;

  if (dim !== 500) {
    if (dim === "ACIMA_3000") {
      bombaTexto = "Demanda acima de 3000 L/h: projeto dedicado (bombas em paralelo + redundância).";
    } else if (m3h <= 1.0) {
      bombaTexto = `Vazão ~${m3h.toFixed(2)} m³/h — Grundfos CM 1/CM 3 ou Schneider equivalente.`;
    } else if (m3h <= 1.5) {
      bombaTexto = `Vazão ~${m3h.toFixed(2)} m³/h — Grundfos CM 3/CM 5 ou Schneider equivalente.`;
    } else {
      bombaTexto = `Vazão ~${m3h.toFixed(2)} m³/h — Grundfos CM 10 ou CRI (depende pressão) / Schneider equivalente.`;
    }
  }

  const dimTexto = (dim === "ACIMA_3000")
    ? "Acima de 3000 L/h"
    : (dim === 500 ? "Mini Central (500 L/h)" : `Central ${dim} L/h`);

  document.getElementById("resultado").innerHTML = `
    <h3>Resultado</h3>
    <p><b>Consumo base:</b> ${qBase.toFixed(0)} L/h</p>
    <p><b>Com margem (25%):</b> ${qSeg.toFixed(0)} L/h</p>
    <p><b>Fator condutividade:</b> ${fator.toFixed(2)} ${cond === null ? "(não informado)" : ""}</p>
    <p><b>Consumo final:</b> ${qFinal.toFixed(0)} L/h (${m3h.toFixed(2)} m³/h)</p>
    <p><b>Dimensionamento:</b> ${dimTexto}</p>
    <p><b>Pressurização:</b> ${bombaTexto}</p>
  `;
}
