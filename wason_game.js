// 게임 상태
let cards = [];
let selectedCards = [];
let showResult = false;

// DOM 요소
const cardsContainer = document.getElementById('cards-container');
const checkBtn = document.getElementById('check-btn');
const selectedCount = document.getElementById('selected-count');
const resultSection = document.getElementById('result-section');
const resultBox = document.getElementById('result-box');
const resultIcon = document.getElementById('result-icon');
const resultTitle = document.getElementById('result-title');
const explanationContent = document.getElementById('explanation-content');
const resetBtn = document.getElementById('reset-btn');

// 카드 생성 함수
function generateCards() {
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const evenNumbers = ['2', '4', '6', '8'];
    const oddNumbers = ['3', '5', '7', '9'];
    
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    const selectedConsonants = [];
    const selectedVowels = [];
    const selectedOdds = [];
    
    // 중복 없이 2개의 자음 선택
    while (selectedConsonants.length < 2) {
        const c = getRandom(consonants);
        if (!selectedConsonants.includes(c)) selectedConsonants.push(c);
    }
    
    // 1개의 모음 선택
    selectedVowels.push(getRandom(vowels));
    
    // 1개의 홀수 선택
    selectedOdds.push(getRandom(oddNumbers));
    
    // 카드 생성
    const newCards = [
        { 
            id: 0, 
            front: selectedConsonants[0], 
            back: getRandom([...evenNumbers, ...oddNumbers]), 
            type: 'consonant' 
        },
        { 
            id: 1, 
            front: selectedConsonants[1], 
            back: getRandom([...evenNumbers, ...oddNumbers]), 
            type: 'consonant' 
        },
        { 
            id: 2, 
            front: selectedVowels[0], 
            back: getRandom([...evenNumbers, ...oddNumbers]), 
            type: 'vowel' 
        },
        { 
            id: 3, 
            front: selectedOdds[0], 
            back: getRandom([...consonants, ...vowels]), 
            type: 'odd' 
        }
    ];
    
    // 카드 순서 섞기
    return newCards.sort(() => Math.random() - 0.5);
}

// 정답 계산
function getCorrectAnswers() {
    return cards
        .filter(card => card.type === 'consonant' || card.type === 'odd')
        .map(card => card.id);
}

// 카드 렌더링
function renderCards() {
    cardsContainer.innerHTML = '';
    
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;
        
        if (selectedCards.includes(card.id)) {
            cardElement.classList.add('selected');
        }
        
        if (showResult) {
            const correctAnswers = getCorrectAnswers();
            if (correctAnswers.includes(card.id)) {
                if (selectedCards.includes(card.id)) {
                    cardElement.classList.add('correct');
                } else {
                    cardElement.classList.add('incorrect');
                }
            } else {
                if (selectedCards.includes(card.id)) {
                    cardElement.classList.add('incorrect');
                }
            }
        }
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <span class="card-value">${card.front}</span>
            </div>
            <div class="check-mark">✓</div>
        `;
        
        cardElement.addEventListener('click', () => toggleCard(card.id));
        cardsContainer.appendChild(cardElement);
    });
    
    updateSelectedCount();
}

// 카드 선택/해제
function toggleCard(cardId) {
    if (showResult) return;
    
    if (selectedCards.includes(cardId)) {
        selectedCards = selectedCards.filter(id => id !== cardId);
    } else {
        selectedCards.push(cardId);
    }
    
    renderCards();
    checkBtn.disabled = selectedCards.length === 0;
}

// 선택된 카드 수 업데이트
function updateSelectedCount() {
    selectedCount.textContent = `선택된 카드: ${selectedCards.length}장`;
}

// 정답 확인
function checkAnswer() {
    showResult = true;
    const correctAnswers = getCorrectAnswers();
    
    const isCorrect = 
        correctAnswers.every(id => selectedCards.includes(id)) &&
        selectedCards.every(id => correctAnswers.includes(id));
    
    renderCards();
    showResultSection(isCorrect);
    checkBtn.style.display = 'none';
    selectedCount.style.display = 'none';
}

// 결과 섹션 표시
function showResultSection(isCorrect) {
    resultSection.style.display = 'block';
    resultBox.className = `result-box ${isCorrect ? 'correct' : 'incorrect'}`;
    
    if (isCorrect) {
        resultIcon.textContent = '✅';
        resultTitle.textContent = '정답입니다! 🎉';
    } else {
        resultIcon.textContent = '❌';
        resultTitle.textContent = '아쉽네요! 😅';
    }
    
    // 해설 생성
    let explanationHTML = '';
    cards.forEach(card => {
        const correctAnswers = getCorrectAnswers();
        const isCorrectCard = correctAnswers.includes(card.id);
        const markClass = isCorrectCard ? 'correct-mark' : 'incorrect-mark';
        const mark = isCorrectCard ? '✓' : '✗';
        
        let explanation = '';
        if (card.type === 'consonant') {
            explanation = `(자음) 뒷면이 짝수인지 확인해야 합니다. (뒷면: ${card.back})`;
        } else if (card.type === 'vowel') {
            explanation = `(모음) 명제는 자음에 대한 것이므로 확인 불필요`;
        } else if (card.type === 'odd') {
            explanation = `(홀수) 뒷면이 자음이 아닌지 확인해야 합니다! (뒷면: ${card.back})`;
        } else {
            explanation = `(짝수) 명제는 "자음→짝수"이므로 확인 불필요`;
        }
        
        explanationHTML += `
            <p class="explanation-item">
                <strong class="${markClass}">${mark} ${card.front}</strong>: ${explanation}
            </p>
        `;
    });
    
    explanationContent.innerHTML = explanationHTML;
}

// 게임 리셋
function reset() {
    cards = generateCards();
    selectedCards = [];
    showResult = false;
    
    renderCards();
    
    checkBtn.style.display = 'inline-block';
    checkBtn.disabled = true;
    selectedCount.style.display = 'block';
    resultSection.style.display = 'none';
}

// 이벤트 리스너
checkBtn.addEventListener('click', checkAnswer);
resetBtn.addEventListener('click', reset);

// 페이지 로드 후 게임 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('게임 초기화 시작');
    reset();
    console.log('카드 생성 완료:', cards);
});