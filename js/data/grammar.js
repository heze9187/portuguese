// Grammar lessons ordered roughly from B1 consolidation to B2.
// Exercise types: typed ({ q, a: [accepted answers] }) or multiple choice ({ q, options, a: index }).
window.PT = window.PT || {};
window.PT.grammar = [
  {
    id: 'perfeito-imperfeito',
    level: 'B1',
    title: 'Pretérito perfeito × imperfeito',
    summary: 'Contar histórias no passado: ação concluída × hábito, descrição e cenário.',
    explanation: `
      <p>The two past tenses do different jobs. Choosing correctly is one of the clearest signs of a B1+ speaker.</p>
      <table>
        <tr><th>Perfeito (fiz, falei)</th><th>Imperfeito (fazia, falava)</th></tr>
        <tr><td>Completed actions at a specific moment</td><td>Habits and repeated actions (“used to”)</td></tr>
        <tr><td>Sequence of events: <em>cheguei, tomei banho e dormi</em></td><td>Descriptions, background, feelings, age, time</td></tr>
        <tr><td>The action that <strong>interrupts</strong></td><td>The action <strong>in progress</strong> (also <em>estava + gerúndio</em>)</td></tr>
        <tr><td><em>ontem, de repente, em 2015, uma vez, já</em></td><td><em>sempre, todo dia, antigamente, quando era criança, enquanto</em></td></tr>
      </table>
      <div class="example">Eu <strong>lia</strong> (pano de fundo) quando o telefone <strong>tocou</strong> (interrupção).</div>
      <div class="example">Quando eu <strong>era</strong> criança, a gente <strong>ia</strong> à praia todo verão.</div>
      <p class="tip">💡 <strong>Era</strong> uma vez… begins every fairy tale: background → imperfeito.</p>`,
    exercises: [
      { q: 'Quando eu era criança, ___ (brincar) na rua todos os dias.', a: ['brincava'] },
      { q: 'Ontem nós ___ (ir) ao cinema.', a: ['fomos'] },
      { q: 'Eu ___ (tomar) banho quando o telefone tocou.', a: ['tomava', 'estava tomando'] },
      { q: 'De repente, ___ (começar) a chover.', a: ['começou'] },
      { q: 'Antigamente, as pessoas ___ (escrever) cartas.', a: ['escreviam'] },
      { q: 'Ela ___ (ter) vinte anos quando se mudou para o Rio.', a: ['tinha'] },
      { q: 'Vocês já ___ (ver) esse filme?', a: ['viram'] },
      { q: 'Enquanto ele cozinhava, eu ___ (arrumar) a casa.', a: ['arrumava', 'estava arrumando'] },
      { q: 'Era meia-noite quando a gente ___ em casa.', options: ['chegou', 'chegava', 'chegamos'], a: 0, why: '“A gente” takes the 3rd person singular, and arriving is a completed action.' },
      { q: 'Eu não ___ (saber) que você falava alemão.', a: ['sabia'] }
    ]
  },
  {
    id: 'subjuntivo-presente',
    level: 'B1',
    title: 'Presente do subjuntivo',
    summary: 'Desejos, dúvidas, emoções e opiniões: espero que você goste.',
    explanation: `
      <p><strong>Formation:</strong> take the <em>eu</em> form of the present, drop the <em>-o</em> and swap the vowel: <em>-ar → -e</em>, <em>-er/-ir → -a</em>.</p>
      <div class="example">falo → fal<strong>e</strong> · faço → faç<strong>a</strong> · tenho → tenh<strong>a</strong> · peço → peç<strong>a</strong></div>
      <p><strong>Irregulars to memorize:</strong> ser → seja, estar → esteja, ir → vá, saber → saiba, querer → queira, dar → dê, haver → haja.</p>
      <p><strong>When to use it</strong>: after <em>que</em> when the main clause expresses:</p>
      <ul>
        <li><strong>Desire / request:</strong> quero que, espero que, peço que, prefiro que</li>
        <li><strong>Emotion:</strong> fico feliz que, tenho medo que, é uma pena que</li>
        <li><strong>Doubt / denial:</strong> duvido que, <em>não</em> acho que, não acredito que</li>
        <li><strong>Impersonal opinion:</strong> é importante que, é possível que, é bom que, é melhor que</li>
        <li><strong>Certain conjunctions:</strong> para que, embora, antes que, caso, a não ser que, sem que, mesmo que</li>
        <li><strong>Talvez</strong> + subjuntivo: <em>talvez ele venha</em></li>
      </ul>
      <p class="tip">⚠️ <em>Acho que ele <strong>tem</strong> razão</em> (indicative: you believe it), but <em>Não acho que ele <strong>tenha</strong> razão</em> (subjunctive: doubt).</p>`,
    exercises: [
      { q: 'Espero que você ___ (gostar) do presente.', a: ['goste'] },
      { q: 'É importante que vocês ___ (chegar) cedo.', a: ['cheguem'] },
      { q: 'Duvido que ele ___ (saber) a resposta.', a: ['saiba'] },
      { q: 'Quero que a gente ___ (ir) junto.', a: ['vá'] },
      { q: 'Talvez ela ___ (estar) cansada.', a: ['esteja'] },
      { q: 'Vou explicar de novo para que todos ___ (entender).', a: ['entendam'] },
      { q: 'Embora ___ (ser) caro, vale a pena.', a: ['seja'] },
      { q: 'Acho que ele ___ razão.', options: ['tem', 'tenha', 'tivesse'], a: 0, why: '“Achar que” expresses belief, so it takes the indicative.' },
      { q: 'Não acho que isso ___ (fazer) diferença.', a: ['faça'] },
      { q: 'Caso você ___ (precisar) de ajuda, me liga.', a: ['precise'] }
    ]
  },
  {
    id: 'subjuntivo-imperfeito',
    level: 'B1+',
    title: 'Imperfeito do subjuntivo e hipóteses',
    summary: 'Se eu tivesse tempo, viajaria mais. Situações hipotéticas e desejos no passado.',
    explanation: `
      <p><strong>Formation:</strong> take the <em>eles</em> form of the pretérito perfeito, drop <em>-ram</em>, add <em>-sse</em>.</p>
      <div class="example">fize<s>ram</s> → fize<strong>sse</strong> · tive<s>ram</s> → tive<strong>sse</strong> · fo<s>ram</s> → fo<strong>sse</strong> · nós: fiz<strong>é</strong>ssemos, f<strong>ô</strong>ssemos</div>
      <p><strong>Main uses:</strong></p>
      <ul>
        <li><strong>Hypotheses:</strong> <em>Se</em> + imperfeito do subjuntivo → futuro do pretérito: <em>Se eu <strong>tivesse</strong> dinheiro, <strong>compraria</strong> uma casa.</em></li>
        <li><strong>Past version of the subjunctive triggers:</strong> <em>Eu queria que você <strong>viesse</strong>. Era importante que eles <strong>soubessem</strong>.</em></li>
        <li><strong>Como se</strong> (as if): <em>Ele fala como se <strong>soubesse</strong> tudo.</em></li>
      </ul>
      <p class="tip">🇧🇷 In everyday speech, Brazilians often use the imperfeito instead of the conditional: <em>Se eu tivesse dinheiro, <strong>comprava</strong> uma casa.</em> Both are correct; the conditional is more formal.</p>`,
    exercises: [
      { q: 'Se eu ___ (ter) mais tempo, estudaria mais.', a: ['tivesse'] },
      { q: 'Se você ganhasse na loteria, o que ___ (fazer)?', a: ['faria', 'fazia'] },
      { q: 'Minha mãe queria que eu ___ (ser) médico.', a: ['fosse'] },
      { q: 'Ele fala como se ___ (saber) tudo.', a: ['soubesse'] },
      { q: 'Se nós ___ (morar) na praia, iríamos nadar todo dia.', a: ['morássemos'] },
      { q: 'Eu ___ (gostar) de conhecer Salvador um dia.', a: ['gostaria'] },
      { q: 'Era necessário que eles ___ (vir) à reunião.', a: ['viessem'] },
      { q: 'Se ___ (poder), eu te ajudaria.', a: ['pudesse'] },
      { q: 'Se eu fosse você, eu não ___ isso.', options: ['faria', 'farei', 'faça'], a: 0, why: 'Hypothetical “se” + imperfeito do subjuntivo pairs with the futuro do pretérito.' },
      { q: 'Pedi que ela me ___ (dizer) a verdade.', a: ['dissesse'] }
    ]
  },
  {
    id: 'subjuntivo-futuro',
    level: 'B1+',
    title: 'Futuro do subjuntivo',
    summary: 'Quando eu chegar, te ligo. Condições e tempo no futuro.',
    explanation: `
      <p>This tense barely exists in English or Spanish speech, but Brazilians use it all the time.</p>
      <p><strong>Formation:</strong> <em>eles</em> form of the pretérito perfeito, drop <em>-ram</em>, add <em>-r</em>: <em>fize<s>ram</s> → fizer, fizermos, fizerem</em>. For regular verbs it looks like the infinitive: <em>chegar, chegarmos, chegarem</em>.</p>
      <p><strong>Use it for future events after:</strong> <em>quando, se, assim que, logo que, enquanto, sempre que, depois que, conforme, como, quem, o que, onde</em>.</p>
      <div class="example"><strong>Quando</strong> eu <strong>chegar</strong>, te ligo.</div>
      <div class="example"><strong>Se</strong> você <strong>quiser</strong>, a gente vai.</div>
      <div class="example">Faça <strong>como</strong> você <strong>achar</strong> melhor.</div>
      <p class="tip">⚠️ Compare: <em>Se você <strong>quiser</strong>…</em> (real future possibility) vs. <em>Se você <strong>quisesse</strong>…</em> (hypothetical).</p>`,
    exercises: [
      { q: 'Quando eu ___ (chegar) em casa, te ligo.', a: ['chegar'] },
      { q: 'Se você ___ (querer), podemos sair hoje.', a: ['quiser'] },
      { q: 'Assim que ela ___ (ter) notícias, vai nos avisar.', a: ['tiver'] },
      { q: 'Enquanto vocês ___ (estar) aqui, fiquem à vontade.', a: ['estiverem'] },
      { q: 'Se nós ___ (fazer) tudo certo, vamos terminar cedo.', a: ['fizermos'] },
      { q: 'Quem ___ (ver) o meu celular, por favor me avise.', a: ['vir'] },
      { q: 'Depois que eles ___ (ir) embora, a gente limpa a casa.', a: ['forem'] },
      { q: 'Se ___ (poder), venha mais cedo.', a: ['puder'] },
      { q: 'Se eu ___ dinheiro, compraria um carro.', options: ['tiver', 'tivesse', 'tenho'], a: 1, why: '“Compraria” makes this hypothetical → imperfeito do subjuntivo.' },
      { q: 'Faça como você ___ (achar) melhor.', a: ['achar'] }
    ]
  },
  {
    id: 'infinitivo-pessoal',
    level: 'B1+',
    title: 'Infinitivo pessoal',
    summary: 'É melhor vocês saírem cedo. Um infinitivo que se conjuga!',
    explanation: `
      <p>A Portuguese specialty: an infinitive with personal endings.</p>
      <table>
        <tr><th>eu</th><th>você/ele</th><th>nós</th><th>vocês/eles</th></tr>
        <tr><td>falar</td><td>falar</td><td>falar<strong>mos</strong></td><td>falar<strong>em</strong></td></tr>
      </table>
      <p><strong>Use it</strong> when the infinitive has its own subject, especially after prepositions and impersonal expressions:</p>
      <div class="example">O professor fala devagar <strong>para</strong> os alunos <strong>entenderem</strong>.</div>
      <div class="example"><strong>É melhor</strong> vocês <strong>saírem</strong> cedo.</div>
      <div class="example"><strong>Antes de</strong> nós <strong>sairmos</strong>, vamos jantar.</div>
      <p class="tip">💡 It often replaces a subjunctive clause: <em>para que eles entendam</em> = <em>para eles entenderem</em>. The second one sounds more natural in Brazil.</p>`,
    exercises: [
      { q: 'É importante nós ___ (estudar) todos os dias.', a: ['estudarmos'] },
      { q: 'O professor falou devagar para os alunos ___ (entender).', a: ['entenderem'] },
      { q: 'Antes de vocês ___ (sair), fechem a janela.', a: ['saírem'] },
      { q: 'Depois de ___ (jantar), nós vimos um filme.', a: ['jantarmos', 'jantar'] },
      { q: 'É melhor eles ___ (fazer) a reserva hoje.', a: ['fazerem'] },
      { q: 'Vamos esperar até elas ___ (chegar).', a: ['chegarem'] },
      { q: 'Obrigado por vocês ___ (vir)!', a: ['virem'] },
      { q: 'Ao ___ em casa, percebemos que a porta estava aberta.', options: ['chegarmos', 'chegamos', 'chegássemos'], a: 0, why: 'After a preposition (ao) → infinitive, inflected for nós.' }
    ]
  },
  {
    id: 'por-para',
    level: 'B1',
    title: 'Por × para',
    summary: 'Causa, troca e trajeto × destino, finalidade e prazo.',
    explanation: `
      <table>
        <tr><th>POR</th><th>PARA (pra)</th></tr>
        <tr><td>Cause / reason: <em>obrigado <strong>por</strong> tudo</em></td><td>Purpose: <em>estudo <strong>para</strong> passar</em></td></tr>
        <tr><td>Through / along: <em>passear <strong>pelo</strong> parque</em></td><td>Destination: <em>vou <strong>para</strong> casa</em></td></tr>
        <tr><td>Exchange / price: <em>paguei 50 reais <strong>por</strong> isso</em></td><td>Deadline: <em><strong>para</strong> sexta-feira</em></td></tr>
        <tr><td>Duration: <em><strong>por</strong> duas semanas</em></td><td>Recipient: <em>é <strong>para</strong> você</em></td></tr>
        <tr><td>Agent of the passive: <em>escrito <strong>por</strong> Machado</em></td><td>Opinion: <em><strong>para</strong> mim, …</em></td></tr>
      </table>
      <p><strong>Contractions:</strong> por + o/a/os/as = <em>pelo, pela, pelos, pelas</em>. In speech, <em>para</em> → <em>pra</em>, <em>para o</em> → <em>pro</em>.</p>`,
    exercises: [
      { q: 'Este presente é ___ você.', a: ['para', 'pra'] },
      { q: 'Obrigado ___ tudo!', a: ['por'] },
      { q: 'Vamos passear ___ parque. (por/para + o)', a: ['pelo'] },
      { q: 'Estudo português ___ trabalhar no Brasil.', a: ['para', 'pra'] },
      { q: 'Paguei cinquenta reais ___ esse livro.', a: ['por'] },
      { q: 'O relatório tem que estar pronto ___ sexta-feira.', a: ['para', 'pra', 'até'] },
      { q: 'O livro foi escrito ___ Machado de Assis.', a: ['por'] },
      { q: 'Ele saiu ___ a praia às sete.', a: ['para', 'pra'] },
      { q: '___ mim, esse é o melhor restaurante da cidade.', a: ['para', 'pra'] },
      { q: 'Fiquei em Recife ___ duas semanas.', a: ['por'] }
    ]
  },
  {
    id: 'pronomes',
    level: 'B1+',
    title: 'Pronomes: fala × escrita',
    summary: 'Te amo, eu vi ele, vou enviá-lo. Os pronomes no Brasil real.',
    explanation: `
      <p>Brazilian Portuguese has two registers for object pronouns. You need to <strong>understand both</strong> and <strong>use</strong> the right one for the situation.</p>
      <table>
        <tr><th></th><th>Fala (informal)</th><th>Escrita (formal)</th></tr>
        <tr><td>Direct object (him/her/it)</td><td>Eu vi <strong>ele</strong>.</td><td>Eu <strong>o</strong> vi.</td></tr>
        <tr><td>After an infinitive</td><td>Vou comprar <strong>ele</strong>.</td><td>Vou comprá-<strong>lo</strong>.</td></tr>
        <tr><td>Indirect object (to you/him)</td><td>Eu <strong>te</strong> disse. / Eu disse <strong>pra ele</strong>.</td><td>Eu <strong>lhe</strong> disse.</td></tr>
        <tr><td>Position</td><td>Before the verb: <strong>Me</strong> liga!</td><td>Formally, not at the start: Ligue-<strong>me</strong>.</td></tr>
      </table>
      <p><strong>Formal rules:</strong> o/a/os/as become <em>-lo/-la</em> after infinitives (comprar → comprá-lo, vender → vendê-lo, abrir → abri-lo), and <em>-no/-na</em> after nasal sounds (fazem → fazem-no). Words like <em>não, que, já, nunca, quem, também</em> pull the pronoun before the verb: <em>Não <strong>me</strong> diga!</em></p>
      <p class="tip">🇧🇷 In Brazil, <em>te</em> is used with <em>você</em> in speech: <em>Você sabe que eu te amo.</em></p>`,
    exercises: [
      { q: 'Formal: “Eu ___ conheço há anos.” (= a Maria)', options: ['a', 'lhe', 'ela'], a: 0, why: 'Direct object, feminine, formal register → a.' },
      { q: 'Informal: “Você viu o João?” — “Vi ___ ontem.”', options: ['ele', 'lhe', 'lo'], a: 0, why: 'In speech, Brazilians use ele/ela as the object.' },
      { q: '“Não ___ preocupe!” (said to você)', options: ['se', 'te', 'lhe'], a: 0, why: 'Reflexive with você → se. In speech you will also hear “não se preocupa”.' },
      { q: 'Formal: “Vou ___ amanhã.” (enviar + o relatório)', a: ['enviá-lo'] },
      { q: '“Ela ___ deu um presente.” (para mim)', a: ['me'] },
      { q: 'Formal: “Eu ___ disse a verdade.” (para ele)', a: ['lhe'] },
      { q: 'Informal: “Quem ___ contou isso?” (para você)', a: ['te'] },
      { q: 'Formal: “Precisamos ___ hoje.” (encontrar + eles)', a: ['encontrá-los'] }
    ]
  },
  {
    id: 'conectivos',
    level: 'B2',
    title: 'Conectivos e coesão',
    summary: 'Embora, no entanto, já que, desde que… A chave para textos de nível B2.',
    explanation: `
      <p>At B2 you are expected to build arguments, not just list sentences. Connectors make the logic visible. Watch which ones take the <strong>subjunctive</strong>.</p>
      <table>
        <tr><th>Função</th><th>Conectivos</th></tr>
        <tr><td>Adição</td><td>além disso, também, inclusive, não só… mas também</td></tr>
        <tr><td>Contraste</td><td>mas, porém, no entanto, contudo, entretanto, por outro lado</td></tr>
        <tr><td>Concessão</td><td><strong>embora*, mesmo que*, ainda que*</strong>, apesar de (+ infinitivo/nome)</td></tr>
        <tr><td>Causa</td><td>porque, já que, uma vez que, visto que, como (at the start of the sentence)</td></tr>
        <tr><td>Consequência</td><td>portanto, por isso, então, logo, de modo que</td></tr>
        <tr><td>Condição</td><td>se, <strong>caso*, desde que*, a menos que*, a não ser que*</strong></td></tr>
        <tr><td>Finalidade</td><td><strong>para que*</strong>, a fim de (+ infinitivo)</td></tr>
      </table>
      <p>* = followed by the subjunctive.</p>
      <div class="example"><strong>Embora</strong> o salário <strong>seja</strong> bom, o trabalho é estressante.</div>
      <div class="example"><strong>Apesar de</strong> o salário <strong>ser</strong> bom, o trabalho é estressante.</div>`,
    exercises: [
      { q: '___ estivesse chovendo, saímos para correr.', options: ['Embora', 'Porque', 'Portanto'], a: 0 },
      { q: 'Ele estudou muito; ___, passou na prova.', options: ['portanto', 'embora', 'apesar de'], a: 0 },
      { q: '___ do trânsito, chegamos a tempo.', options: ['Apesar', 'Embora', 'Mesmo que'], a: 0, why: '“Apesar de” + noun (de + o = do).' },
      { q: '___ você já está aqui, vamos começar.', options: ['Já que', 'Embora', 'Caso'], a: 0 },
      { q: 'Posso te emprestar o carro, ___ você tome cuidado.', options: ['desde que', 'porque', 'portanto'], a: 0, why: '“Desde que” + subjuntivo = as long as.' },
      { q: 'O plano é bom. ___, é caro demais.', options: ['No entanto', 'Por isso', 'Além disso'], a: 0 },
      { q: 'Ela fala inglês e espanhol. ___, está aprendendo japonês.', options: ['Além disso', 'Contudo', 'Embora'], a: 0 },
      { q: 'Mesmo que ele ___ (pedir) desculpas, não vou perdoar.', a: ['peça'] },
      { q: '___ não havia ônibus, fomos a pé.', options: ['Como', 'Embora', 'Desde que'], a: 0, why: '“Como” at the start of a sentence = since/because.' }
    ]
  },
  {
    id: 'voz-passiva',
    level: 'B2',
    title: 'Voz passiva e o “se”',
    summary: 'Foi construída em 1950. Vendem-se casas. Precisa-se de vendedores.',
    explanation: `
      <p><strong>Analytic passive:</strong> <em>ser</em> + past participle (agrees in gender/number) + <em>por</em> (agent).</p>
      <div class="example">As casas <strong>foram construídas</strong> pela prefeitura.</div>
      <p><strong>Synthetic passive with <em>se</em>:</strong> the verb agrees with the thing.</p>
      <div class="example">Vend<strong>e</strong>-se casa. · Vend<strong>em</strong>-se casas. · Alug<strong>a</strong>-se apartamento.</div>
      <p><strong>Indeterminate subject:</strong> with a preposition, the verb stays singular.</p>
      <div class="example">Precisa-se <strong>de</strong> funcionários. · Trata-se <strong>de</strong> um caso grave.</div>
      <p><strong>Irregular participles:</strong> feito, dito, escrito, visto, vindo, posto, aberto, coberto, pago, ganho, gasto.</p>
      <p class="tip">🇧🇷 In speech, people often say <em>“Aluga casa”</em> or use <em>eles / a gente / você</em> for general statements: <em>No Brasil, <strong>a gente</strong> almoça arroz e feijão.</em></p>`,
    exercises: [
      { q: 'O livro foi ___ (escrever) em 1899.', a: ['escrito'] },
      { q: 'As cartas foram ___ (enviar) ontem.', a: ['enviadas'] },
      { q: '___ apartamentos. (alugar, written sign, formal)', a: ['alugam-se'] },
      { q: '___ de vendedores. (precisar, job ad)', a: ['precisa-se'] },
      { q: 'A ponte ___ (ser) inaugurada no ano que vem.', a: ['será', 'vai ser'] },
      { q: 'Os documentos estão sendo ___ (analisar).', a: ['analisados'] },
      { q: 'O problema foi ___ (resolver) pela equipe.', a: ['resolvido'] },
      { q: 'As portas foram ___ (abrir) às nove horas.', a: ['abertas'] },
      { q: 'Aqui ___ português.', options: ['fala-se', 'falam-se', 'falamos-se'], a: 0, why: '“Português” is singular → fala-se.' }
    ]
  },
  {
    id: 'tempos-compostos',
    level: 'B2',
    title: 'Tempos compostos',
    summary: 'Tinha feito, tenho feito, teria feito, tivesse feito.',
    explanation: `
      <p>Compound tenses use <em>ter</em> (or more formally <em>haver</em>) + past participle (invariable).</p>
      <table>
        <tr><th>Tense</th><th>Example</th><th>Meaning</th></tr>
        <tr><td>Mais-que-perfeito</td><td>Eu <strong>tinha saído</strong>.</td><td>I had left (before another past event)</td></tr>
        <tr><td>Pretérito perfeito composto</td><td>Eu <strong>tenho trabalhado</strong> muito.</td><td>I've been working a lot (repeated, up to now)</td></tr>
        <tr><td>Futuro composto</td><td>Eu <strong>terei terminado</strong>.</td><td>I will have finished</td></tr>
        <tr><td>Futuro do pretérito composto</td><td>Eu <strong>teria ido</strong>.</td><td>I would have gone</td></tr>
        <tr><td>Mais-que-perfeito do subjuntivo</td><td>Se eu <strong>tivesse sabido</strong>…</td><td>If I had known…</td></tr>
      </table>
      <div class="example">Se eu <strong>tivesse sabido</strong>, <strong>teria vindo</strong>. (If I had known, I would have come.)</div>
      <p class="tip">⚠️ The trap: “I have read this book” is <em>Eu <strong>já li</strong> esse livro</em>, <strong>not</strong> <em>tenho lido</em>. The perfeito composto only means a repeated or continuing action: <em>Tenho lido muito ultimamente</em> = I've been reading a lot lately.</p>`,
    exercises: [
      { q: 'Quando chegamos, o show já ___ (começar). [ter + particípio]', a: ['tinha começado', 'havia começado'] },
      { q: 'Eu ___ (trabalhar) muito ultimamente. [ter no presente + particípio]', a: ['tenho trabalhado'] },
      { q: 'Se eu tivesse estudado, ___ (passar) na prova.', a: ['teria passado', 'tinha passado'] },
      { q: 'Se você ___ (chegar) mais cedo, teria visto o João.', a: ['tivesse chegado'] },
      { q: 'Ela nunca ___ (ver) o mar antes daquela viagem.', a: ['tinha visto', 'havia visto'] },
      { q: 'Até o fim do ano, nós já ___ (terminar) o projeto.', a: ['teremos terminado'] },
      { q: 'Ele disse que já ___ (fazer) o dever.', a: ['tinha feito', 'havia feito'] },
      { q: '“I have already read this book.”', options: ['Eu já li esse livro.', 'Eu tenho lido esse livro.', 'Eu lia esse livro.'], a: 0, why: 'A single completed action → pretérito perfeito simples.' }
    ]
  },
  {
    id: 'discurso-indireto',
    level: 'B2',
    title: 'Discurso indireto',
    summary: 'Ele disse que estava cansado. Recontar o que os outros disseram.',
    explanation: `
      <p>When you report speech with a past verb (<em>disse, contou, perguntou, pediu</em>), tenses shift back:</p>
      <table>
        <tr><th>Discurso direto</th><th>Discurso indireto</th></tr>
        <tr><td>Presente: “Estou cansado.”</td><td>Imperfeito: Ele disse que <strong>estava</strong> cansado.</td></tr>
        <tr><td>Perfeito: “Comprei um carro.”</td><td>Mais-que-perfeito: Ele disse que <strong>tinha comprado</strong> um carro.</td></tr>
        <tr><td>Futuro: “Farei isso.” / “Vou fazer.”</td><td>Futuro do pretérito: Ele disse que <strong>faria</strong> / <strong>ia fazer</strong> isso.</td></tr>
        <tr><td>Imperativo: “Feche a porta!”</td><td>Imperfeito do subj.: Ele pediu que eu <strong>fechasse</strong> a porta.</td></tr>
      </table>
      <p><strong>Time and place words also shift:</strong> hoje → naquele dia · amanhã → no dia seguinte · ontem → no dia anterior · aqui → ali/lá · este → aquele.</p>`,
    exercises: [
      { q: '“Estou cansado.” → Ele disse que ___ cansado.', a: ['estava'] },
      { q: '“Vou viajar amanhã.” → Ela disse que ___ viajar no dia seguinte.', a: ['ia'] },
      { q: '“Eu comprei um carro.” → Ele contou que ___ um carro.', a: ['tinha comprado', 'havia comprado'] },
      { q: '“Farei o possível.” → Ela prometeu que ___ o possível.', a: ['faria'] },
      { q: '“Feche a porta!” → Ele pediu que eu ___ a porta.', a: ['fechasse'] },
      { q: '“Você pode me ajudar?” → Ela perguntou se eu ___ ajudá-la.', a: ['podia', 'poderia'] },
      { q: '“Moramos aqui.” → Eles disseram que ___ ali.', a: ['moravam'] },
      { q: '“Hoje está frio.” → Ele disse que ___ estava frio.', options: ['naquele dia', 'hoje', 'no dia seguinte'], a: 0 }
    ]
  },
  {
    id: 'perifrases',
    level: 'B1+',
    title: 'Perífrases verbais',
    summary: 'Acabei de chegar, costumo acordar cedo, ando dormindo mal…',
    explanation: `
      <p>Verb + verb combinations make your speech sound natural and precise.</p>
      <table>
        <tr><th>Perífrase</th><th>Meaning</th><th>Example</th></tr>
        <tr><td>estar + gerúndio</td><td>be doing</td><td>Estou estudando.</td></tr>
        <tr><td>ir + infinitivo</td><td>going to (spoken future)</td><td>Vou viajar amanhã.</td></tr>
        <tr><td>acabar de + inf.</td><td>have just done</td><td>Acabei de chegar.</td></tr>
        <tr><td>voltar a + inf.</td><td>do again</td><td>Voltei a estudar.</td></tr>
        <tr><td>costumar + inf.</td><td>usually do</td><td>Costumo acordar cedo.</td></tr>
        <tr><td>deixar de + inf.</td><td>stop doing</td><td>Deixei de fumar.</td></tr>
        <tr><td>ficar + gerúndio</td><td>keep doing (for a while)</td><td>Fiquei esperando duas horas.</td></tr>
        <tr><td>andar + gerúndio</td><td>have been doing lately</td><td>Ando dormindo mal.</td></tr>
        <tr><td>vir + gerúndio</td><td>has been gradually doing</td><td>A situação vem melhorando.</td></tr>
        <tr><td>chegar a + inf.</td><td>go as far as / actually do</td><td>Cheguei a pensar em desistir.</td></tr>
      </table>`,
    exercises: [
      { q: 'Eu ___ de chegar, ainda nem tirei o casaco. (acabar)', a: ['acabei'] },
      { q: 'Você ___ acordar cedo nos fins de semana? (costumar)', a: ['costuma'] },
      { q: 'Ele parou de fumar = Ele ___ de fumar.', a: ['deixou'] },
      { q: 'Depois de anos, ela voltou a ___ (pintar).', a: ['pintar'] },
      { q: 'Fiquei ___ (esperar) duas horas!', a: ['esperando'] },
      { q: 'Ultimamente, eu ando ___ (dormir) mal.', a: ['dormindo'] },
      { q: 'Amanhã a gente ___ (ir) visitar a vovó.', a: ['vai'] },
      { q: 'A economia ___ melhorando aos poucos.', options: ['vem', 'acaba', 'costuma'], a: 0, why: 'vir + gerúndio = gradual change over time.' },
      { q: 'O que você está ___ (fazer)?', a: ['fazendo'] }
    ]
  }
];
