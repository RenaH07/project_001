// ==== 自動ID生成 ====
function generateParticipantID(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

const timeline = [];

// ==== イントロダクション ====
timeline.push({
  type: 'html-button-response',
  stimulus: `
    <h2>実験へようこそ！</h2>
    <p>この研究では、図形の動きを見て感じた印象を評価していただきます。</p>
    <p>所要時間は数分です。準備ができたら「次へ」を押してください。</p>
  `,
  choices: ['次へ']
});

// ==== 同意 ====
timeline.push({
  type: 'html-button-response',
  stimulus: `
    <h3>同意確認</h3>
    <p>この研究は学術目的で行われています。参加は自由で、途中で中止しても構いません。</p>
    <p>データは匿名で扱われます。ご同意いただける場合は、以下をクリックしてください。</p>
  `,
  choices: ['同意します']
});

// ==== 操作説明 ====
timeline.push({
  type: 'html-button-response',
  stimulus: `
    <h3>操作説明</h3>
    <p>図形が動くアニメーションが表示されます。</p>
    <p>見終わったら「次へ」ボタンを押し、評価をしてください。</p>
  `,
  choices: ['練習を始める']
});

// ==== 練習 ====
timeline.push({
  type: 'html-button-response',
  stimulus: '<iframe src="stimuli/perfect_straight_speed2.5.html" width="820" height="620" frameborder="0"></iframe>',
  choices: ['次へ'],
  prompt: "<p>アニメーションを見終わったら「次へ」を押してください。</p>"
});

timeline.push({
  type: 'survey-likert',
  preamble: "<h3>評価</h3><p>アニメーションを見てどう感じたかを7段階で評価してください。</p>",
  questions: [
    {prompt: "かわいいと感じましたか？", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true},
    {prompt: "ぎこちなさを感じましたか？", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true},
    {prompt: "意図を感じましたか？", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true},
    {prompt: "Tenderness（守ってあげたい気持ち）を感じましたか？", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true}
  ]
});

// ==== 本番案内 ====
timeline.push({
  type: 'html-button-response',
  stimulus: `
    <h3>本番開始</h3>
    <p>ここからが本番です。同じ形式でアニメーションが3つ表示されます。</p>
    <p>それぞれ評価をお願いします。</p>
  `,
  choices: ['開始する']
});

// ==== 刺激リスト（シャッフル付き） ====
const stimuliFiles = [
  "stimuli/low_giko_speed2.5.html",
  "stimuli/medium_giko_speed2.5.html",
  "stimuli/high_giko_speed2.5.html"
];
const shuffledStimuli = jsPsych.randomization.shuffle(stimuliFiles);

// ==== 刺激提示 & 評価 ====
shuffledStimuli.forEach(file => {
  timeline.push({
    type: 'html-button-response',
    stimulus: `<iframe src="${file}" width="820" height="620" frameborder="0"></iframe>`,
    choices: ['次へ'],
    prompt: "<p>アニメーションを見終わったら「次へ」を押してください。</p>"
  });

  timeline.push({
    type: 'survey-likert',
    preamble: "<h3>評価</h3><p>アニメーションを見てどう感じたかを7段階で評価してください。</p>",
    questions: [
      {prompt: "かわいいと感じましたか？", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true},
      {prompt: "ぎこちなさを感じましたか？", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true},
      {prompt: "意図を感じましたか？", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true},
      {prompt: "Tenderness（守ってあげたい気持ち）を感じましたか？", labels: ["全く思わない", "", "", "", "", "", "とてもそう思う"], required: true}
    ]
  });
});

// ==== 背景質問 ====
timeline.push({
  type: 'survey-html-form',
  preamble: "<h3>最後に、いくつかの質問にお答えください。</h3>",
  html: `
    年齢：<input name="age" type="number" required><br><br>
    性別：
    <select name="gender" required>
      <option value="">選択してください</option>
      <option value="female">女性</option>
      <option value="male">男性</option>
      <option value="other">その他</option>
    </select><br><br>
    お子さんはいますか？<br>
    <input type="radio" name="has_children" value="yes" required> はい
    <input type="radio" name="has_children" value="no"> いいえ
  `,
  button_label: "送信"
});

// ==== 終了画面 ====
timeline.push({
  type: 'html-button-response',
  stimulus: `
    <h2>ご協力ありがとうございました！</h2>
    <p>これで実験は終了です。</p>
  `,
  choices: ['完了']
});

// ==== jsPsych初期化 & データ送信 ====
jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    const participantID = generateParticipantID();
    const likertAll = jsPsych.data.get().filter({trial_type: 'survey-likert'}).values();
    const stimulusTrials = jsPsych.data.get().filter({trial_type: 'html-button-response'}).values();
    const background = jsPsych.data.get().filter({trial_type: 'survey-html-form'}).values()[0].response;

    const responses = [];

    for (let i = 0; i < shuffledStimuli.length; i++) {
      const stim_html = stimulusTrials[i].stimulus;
      const fileMatch = stim_html.match(/src="([^"]+)"/);
      const stimulusFile = fileMatch ? fileMatch[1] : `unknown_${i}`;

      responses.push({
        stimulus: stimulusFile,
        Q0: likertAll[i].response.Q0,
        Q1: likertAll[i].response.Q1,
        Q2: likertAll[i].response.Q2,
        Q3: likertAll[i].response.Q3
      });
    }

    const dataToSend = {
      id: participantID,
      age: background.age,
      gender: background.gender,
      has_children: background.has_children,
      responses: responses
    };

    console.log("送信データ:", dataToSend);

    // 🔁 確実にフォームが読み込まれたあとに送信
    function waitForFormAndSubmit(dataToSend, attempts = 10) {
      const field = document.getElementById("data-field");

      if (field) {
        field.value = JSON.stringify(dataToSend);
        document.querySelector("form[name='experiment-data']").submit();
      } else if (attempts > 0) {
        setTimeout(() => waitForFormAndSubmit(dataToSend, attempts - 1), 100);
      } else {
        console.error("フォームの input[data-field] が見つかりませんでした！");
      }
    }

    waitForFormAndSubmit(dataToSend);
  }
});
