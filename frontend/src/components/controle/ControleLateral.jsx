import './ControleLateral.css';

export default function ControleLateral({
  fase,
  setAltura,
  setLado,

  // 🔥 novos
  golpes,
  golpeSelecionado,
  onSelecionarGolpe,
  mostrarGolpes,
  onToggleGolpes,
  onRolar,
  podeConfirmar,
}) {
  const emAtaque = fase === 'aguardandoAtaque';
  const emDefesa = fase === 'aguardandoDefesa';

  return (
    <aside className="controle-lateral">
      {/* 🗡 Golpes (aparecem acima do ATK) */}
      {(emAtaque || emDefesa) && mostrarGolpes && (
        <div className="controle-golpes">
          {golpes.map(g => (
            <button
              key={g.id}
              className={`btn-golpe ${
                golpeSelecionado === g.id ? 'ativo' : ''
              }`}
              onClick={() => onSelecionarGolpe(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      {/* 🎮 Ações principais */}
      <div className="controle-acoes">
        {emAtaque && (
          <button className="btn red" onClick={onToggleGolpes}>
            ATK
          </button>
        )}

        {emDefesa && (
          <button className="btn blue" onClick={onToggleGolpes}>
            DEF
          </button>
        )}

        <button
          className={`btn yellow ${podeConfirmar ? 'piscar' : ''}`}
          onClick={onRolar}
        >
          🎲
        </button>
      </div>

      {/* 🧭 Direções */}
      <div className="controle-direcional">
        <button className="btn-direcao up" onClick={() => setAltura('alto')}>
          ⬆️
        </button>

        <button
          className="btn-direcao left"
          onClick={() => setLado('esquerda')}
        >
          ⬅️
        </button>

        <button
          className="btn-direcao center"
          onClick={() => setLado('frontal')}
        >
          ⏺
        </button>

        <button
          className="btn-direcao right"
          onClick={() => setLado('direita')}
        >
          ➡️
        </button>

        <button className="btn-direcao down" onClick={() => setAltura('baixo')}>
          ⬇️
        </button>
      </div>
    </aside>
  );
}
