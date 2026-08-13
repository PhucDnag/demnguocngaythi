// --- 1. THEME TOGGLE ---
// --- ANTI-COPY & DEVTOOLS BLOCKER ---
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) || (e.ctrlKey && e.key.toUpperCase() === 'U')) {
    e.preventDefault();
  }
});

const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const newTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// --- 2. MAIN COUNTDOWN (2027) ---
// Target: June 11, 2027 - 07:30 AM
const targetDate = new Date('2027-06-11T07:30:00+07:00');
const elDays = document.getElementById('days');
const elHours = document.getElementById('hours');
const elMinutes = document.getElementById('minutes');
const elSeconds = document.getElementById('seconds');

setInterval(() => {
  const diff = targetDate.getTime() - new Date().getTime();
  if (diff > 0) {
    const t = Math.floor(diff / 1000);
    elDays.textContent = String(Math.floor(t / 86400)).padStart(2, '0');
    elHours.textContent = String(Math.floor((t % 86400) / 3600)).padStart(2, '0');
    elMinutes.textContent = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
    elSeconds.textContent = String(t % 60).padStart(2, '0');
  } else {
    elDays.textContent = '00';
    elHours.textContent = '00';
    elMinutes.textContent = '00';
    elSeconds.textContent = '00';
  }
}, 1000);

// --- 3. TO-DO LIST (LOCALSTORAGE) ---
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

let todos = JSON.parse(localStorage.getItem('todos_2k9')) || [];

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
      <span class="todo-text">${escapeHTML(todo.text)}</span>
      <button class="todo-delete" onclick="deleteTodo(${index})" aria-label="Xóa">✕</button>
    `;
    todoList.appendChild(li);
  });
}

function addTodo(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ text, completed: false });
    saveAndRenderTodos();
    todoInput.value = '';
  }
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveAndRenderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveAndRenderTodos();
}

function saveAndRenderTodos() {
  localStorage.setItem('todos_2k9', JSON.stringify(todos));
  renderTodos();
}

todoForm.addEventListener('submit', addTodo);
renderTodos(); // Initial render

// --- 4. TIMERS (STOPWATCH & COUNTDOWN) ---
// Tabs Logic
const tabStopwatch = document.getElementById('tabStopwatch');
const tabCountdown = document.getElementById('tabCountdown');
const panelStopwatch = document.getElementById('panelStopwatch');
const panelCountdown = document.getElementById('panelCountdown');

function setActiveTimerTab(tab) {
  const isStopwatch = tab === 'stopwatch';
  tabStopwatch.classList.toggle('active', isStopwatch);
  tabCountdown.classList.toggle('active', !isStopwatch);
  panelStopwatch.classList.toggle('active', isStopwatch);
  panelCountdown.classList.toggle('active', !isStopwatch);
}
tabStopwatch.addEventListener('click', () => setActiveTimerTab('stopwatch'));
tabCountdown.addEventListener('click', () => setActiveTimerTab('countdown'));

// Stopwatch Logic
let swSeconds = 0, swInterval = null, swRunning = false;
const swDisplay = document.getElementById('stopwatchDisplay');
const btnSwToggle = document.getElementById('btnStopwatchToggle');
const btnSwReset = document.getElementById('btnStopwatchReset');

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

btnSwToggle.addEventListener('click', () => {
  if (swRunning) {
    clearInterval(swInterval);
    swRunning = false;
    btnSwToggle.textContent = 'Tiếp tục';
  } else {
    swRunning = true;
    btnSwToggle.textContent = 'Dừng';
    swInterval = setInterval(() => {
      swSeconds++;
      swDisplay.textContent = formatTime(swSeconds);
    }, 1000);
  }
});

btnSwReset.addEventListener('click', () => {
  clearInterval(swInterval);
  swSeconds = 0;
  swRunning = false;
  btnSwToggle.textContent = 'Bắt đầu';
  swDisplay.textContent = '00:00:00';
});

// Subject Timer Logic
let subTotal = 90 * 60, subLeft = subTotal, subInterval = null, subRunning = false;
const subSelect = document.getElementById('subjectSelect');
const subDisplay = document.getElementById('subjectTimerDisplay');
const btnSubStart = document.getElementById('btnSubjectStart');
const btnSubReset = document.getElementById('btnSubjectReset');

function updateSubDisplay() {
  const m = Math.floor(subLeft / 60);
  const s = subLeft % 60;
  subDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function resetSubjectTimer() {
  clearInterval(subInterval);
  subRunning = false;
  const minutes = parseInt(subSelect.value, 10);
  subTotal = minutes * 60;
  subLeft = subTotal;
  updateSubDisplay();
  btnSubStart.textContent = 'Bắt đầu';
}

subSelect.addEventListener('change', resetSubjectTimer);

btnSubStart.addEventListener('click', () => {
  if (subRunning) {
    clearInterval(subInterval);
    subRunning = false;
    btnSubStart.textContent = 'Tiếp tục';
  } else {
    subRunning = true;
    btnSubStart.textContent = 'Dừng';
    subInterval = setInterval(() => {
      if (subLeft > 0) {
        subLeft--;
        updateSubDisplay();
      } else {
        clearInterval(subInterval);
        subRunning = false;
        btnSubStart.textContent = 'Bắt đầu';
      }
    }, 1000);
  }
});

btnSubReset.addEventListener('click', resetSubjectTimer);
resetSubjectTimer();

// --- 5. MUSIC PLAYER ---
const btnPlayMusic = document.getElementById('btnPlayMusic');
const ytbInput = document.getElementById('ytbInput');
const ytbFrame = document.getElementById('ytbFrame');

function setMusicError(message) {
  ytbFrame.src = 'https://www.youtube.com/embed/error';
  ytbFrame.style.border = '1px solid rgba(239, 68, 68, 0.45)';
  ytbFrame.style.background = 'rgba(239, 68, 68, 0.08)';
  ytbFrame.title = message;
}

function playMusic() {
  const url = ytbInput.value.trim();
  if (!url) return setMusicError('Vui lòng dán link YouTube hợp lệ.');

  let vid = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (vid) {
    ytbFrame.src = `https://www.youtube.com/embed/${vid[1]}?autoplay=1`;
    ytbFrame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    ytbFrame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  } else {
    setMusicError('Không nhận diện được ID video. Hãy dán link chuẩn (VD: youtu.be/xyz).');
  }
}
btnPlayMusic.addEventListener('click', playMusic);
ytbInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); playMusic(); }
});

// --- 6. QUOTES ROTATION ---
const quotes = [
  { text: 'Nỗ lực hôm nay, huy hoàng ngày mai. Hãy cố gắng!', author: 'Khuyết danh' },
  { text: 'Kỷ luật là cầu nối giữa mục tiêu và thành tựu.', author: 'Jim Rohn' },
  { text: 'Bạn không cần xuất sắc ngay lập tức, chỉ cần không bỏ cuộc.', author: 'Khuyết danh' },
  { text: 'Thành công thích những người kiên trì hơn là bốc đồng.', author: 'Khuyết danh' },
  { text: 'Mục tiêu lớn được hoàn thành từ những việc nhỏ lặp lại mỗi ngày.', author: 'Khuyết danh' }
];
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const btnNewQuote = document.getElementById('btnNewQuote');

btnNewQuote.addEventListener('click', () => {
  const current = quoteText.textContent.replace(/"/g, '');
  let next = quotes[Math.floor(Math.random() * quotes.length)];
  while(next.text === current && quotes.length > 1) {
    next = quotes[Math.floor(Math.random() * quotes.length)];
  }
  
  const wrapper = document.querySelector('.quote-wrapper');
  wrapper.style.opacity = '0';
  setTimeout(() => {
    quoteText.textContent = `"${next.text}"`;
    quoteAuthor.textContent = `- ${next.author}`;
    wrapper.style.opacity = '1';
  }, 200);
});

// --- 7. CHAT DIALOG LOGIC ---
const chatFab = document.getElementById('chatFab');
const chatDialog = document.getElementById('chatDialog');
const closeChat = document.getElementById('closeChat');

chatFab.addEventListener('click', () => {
  chatDialog.showModal();
  setTimeout(() => {
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 10);
});
closeChat.addEventListener('click', () => {
  chatDialog.close();
});
// Đóng dialog khi click ra ngoài (click vào backdrop)
chatDialog.addEventListener('click', (e) => {
  const rect = chatDialog.getBoundingClientRect();
  if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
    chatDialog.close();
  }
});

// --- 8. FIREBASE REALTIME CHAT LOGIC ---
const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
const chatName = document.getElementById('chatName');
const btnSendChat = document.getElementById('btnSendChat');
const chatStatus = document.getElementById('chatStatus');

const firebaseConfig = {
  apiKey: "AIzaSyCeQZ7a54zvQfYMaXLeodmbQ9ZZ5R9C7M4",
  authDomain: "demnguoc-2027.firebaseapp.com",
  projectId: "demnguoc-2027",
  storageBucket: "demnguoc-2027.firebasestorage.app",
  messagingSenderId: "404275563579",
  appId: "1:404275563579:web:5cef1ec158b33b58c1a01e"
};

let db = null;
let currentUserId = localStorage.getItem('chat_user_id') || '';

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function appendMessage(name, text, type) {
  const msgWrapper = document.createElement('div');
  msgWrapper.className = `msg-wrapper ${type}`;
  msgWrapper.innerHTML = `
    <span class="msg-sender">${escapeHTML(name)}</span>
    <div class="msg-bubble">${escapeHTML(text)}</div>
  `;
  chatBox.appendChild(msgWrapper);
  
  // Trì hoãn 1 chút để UI kịp render rồi mới cuộn
  setTimeout(() => {
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 10);
}

function updateSysMsg(text) {
  if (!text) {
    chatStatus.style.display = 'none';
  } else {
    chatStatus.style.display = 'block';
    chatStatus.textContent = text;
  }
}

function prependMessage(name, text, type) {
  const msgWrapper = document.createElement('div');
  msgWrapper.className = `msg-wrapper ${type}`;
  msgWrapper.innerHTML = `
    <span class="msg-sender">${escapeHTML(name)}</span>
    <div class="msg-bubble">${escapeHTML(text)}</div>
  `;
  
  // Chèn ngay sau tin nhắn chào mừng
  const welcomeMsg = chatBox.querySelector('.sys-msg');
  if (welcomeMsg && welcomeMsg.nextSibling) {
    chatBox.insertBefore(msgWrapper, welcomeMsg.nextSibling);
  } else {
    chatBox.appendChild(msgWrapper);
  }
}

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();

  // Generate a random ID if not exists
  if (!currentUserId) {
    currentUserId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chat_user_id', currentUserId);
  }

  updateSysMsg(''); // Xóa dòng "Đang kết nối..."
  
  let oldestDoc = null;
  let isLoadingOlder = false;
  
  // Load 20 tin nhắn mới nhất
  chatBox.innerHTML = '<div class="sys-msg">Chào mừng bạn gia nhập cộng đồng ôn thi 2K9. Hãy giữ văn hóa lịch sự nhé!</div>';
  
  db.collection('chats_2k9')
    .orderBy('timestamp', 'asc')
    .limitToLast(20)
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          appendMessage(data.name || 'Ẩn danh', data.text || '', (data.uid === currentUserId) ? 'self' : 'others');
          // Lưu lại tin nhắn cũ nhất trong lần load đầu
          if (!oldestDoc) oldestDoc = change.doc;
        }
      });
    }, (error) => {
      console.error("Lỗi nghe tin nhắn:", error);
      updateSysMsg('Lỗi đồng bộ: ' + error.message);
    });

  // Sự kiện lướt lên trên cùng để load thêm tin nhắn cũ
  chatBox.addEventListener('scroll', async () => {
    if (chatBox.scrollTop === 0 && oldestDoc && !isLoadingOlder) {
      isLoadingOlder = true;
      const oldScrollHeight = chatBox.scrollHeight;

      const snap = await db.collection('chats_2k9')
        .orderBy('timestamp', 'desc')
        .startAfter(oldestDoc)
        .limit(20)
        .get();
        
      if (!snap.empty) {
        oldestDoc = snap.docs[snap.docs.length - 1];
        
        snap.docs.forEach(doc => {
           const data = doc.data();
           prependMessage(data.name || 'Ẩn danh', data.text || '', (data.uid === currentUserId) ? 'self' : 'others');
        });
        
        // Giữ nguyên vị trí cuộn
        chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;
      }
      isLoadingOlder = false;
    }
  });

} catch(e) {
  updateSysMsg('Lỗi khởi tạo Firebase.');
  console.error(e);
}

let lastMessageTime = 0;
const chatNameContainer = document.getElementById('chatNameContainer');
const btnChangeName = document.getElementById('btnChangeName');

function showNameInput() {
  chatNameContainer.style.display = 'block';
  btnChangeName.style.display = 'none';
  chatName.focus();
}

function hideNameInput() {
  chatNameContainer.style.display = 'none';
  btnChangeName.style.display = 'block';
}

btnChangeName.addEventListener('click', showNameInput);

async function sendMessage() {
  const text = chatInput.value.trim();
  let name = chatName.value.trim();
  
  if(!name) { name = 'Ẩn danh 2K9'; }
  else {
    localStorage.setItem('chat_name_2k9', name);
  }

  if(!text || !db) return;
  
  const now = Date.now();
  if (now - lastMessageTime < 2500) {
    updateSysMsg('Gửi chậm lại một chút nhé!');
    return;
  }
  lastMessageTime = now;
  
  hideNameInput();
  
  chatInput.disabled = true;
  btnSendChat.disabled = true;

  try {
    await db.collection('chats_2k9').add({
      uid: currentUserId,
      name: name,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    chatInput.value = '';
    updateSysMsg('');
  } catch(e) {
    updateSysMsg('Gửi thất bại. Hãy thử lại.');
    console.error(e);
  } finally {
    chatInput.disabled = false;
    btnSendChat.disabled = false;
    chatInput.focus();
  }
}

// Khôi phục tên cũ
if(localStorage.getItem('chat_name_2k9')) {
  chatName.value = localStorage.getItem('chat_name_2k9');
  hideNameInput();
}

btnSendChat.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
});
