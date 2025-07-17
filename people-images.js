const peopleData = {
    'Donald Trump': {
        'Default': 'images/people/donald-trump/1.png',
        'Happy': 'images/people/donald-trump/2.png',
        'Sad': 'images/people/donald-trump/3.png',
        'Angry': 'images/people/donald-trump/4.png',
        'Surprised': 'images/people/donald-trump/5.png',
    },
    'JP': {
        'Default': 'images/people/jp/anime-jp-rant.png',
        'Angry': 'images/people/jp/anime-jp-angry.png',
        'Blondie': 'images/people/jp/anime-jp-blondie.png',
        'Red': 'images/people/jp/anime-jp-red.png',
        'Thinking': 'images/people/jp/anime-jp-thinking.png',
        'Whaaat': 'images/people/jp/anime-jp-whaat.png',
    },
    'Greg': {
        'Default': 'images/people/greg/channelpic.png',
        'Cartoon Greg': 'images/people/greg/cartoonpic.png',
    },
    'Rick': {
        'Default': 'images/people/rick/rick.png',
    }

};

function showPersonPicker() {
    document.getElementById('person-picker-modal').style.display = 'block';
    showPersonPickerStep1();
}

function closePersonPicker() {
    document.getElementById('person-picker-modal').style.display = 'none';
}

function showPersonPickerStep1() {
    const step1 = document.getElementById('person-picker-step1');
    const step2 = document.getElementById('person-picker-step2');
    step1.style.display = 'block';
    step2.style.display = 'none';

    const personGrid = document.getElementById('person-selection-grid');
    console.log('Debugging person-selection-grid:', personGrid);
    personGrid.innerHTML = '';
    for (const personName in peopleData) {
        const personContainer = document.createElement('div');
        personContainer.className = 'grid-item';
        personContainer.addEventListener('click', () => selectPerson(personName));

        const img = document.createElement('img');
        img.src = peopleData[personName]['Default'];
        img.alt = personName;

        const label = document.createElement('p');
        label.textContent = personName;

        personContainer.appendChild(img);
        personContainer.appendChild(label);
        personGrid.appendChild(personContainer);
    }
}

function selectPerson(personName) {
    const step1 = document.getElementById('person-picker-step1');
    const step2 = document.getElementById('person-picker-step2');
    step1.style.display = 'none';
    step2.style.display = 'block';

    document.getElementById('selected-person-name').textContent = personName;

    const emotionGrid = document.getElementById('emotion-selection-grid');
    emotionGrid.innerHTML = '';
    const emotions = peopleData[personName];
    for (const emotionName in emotions) {
        const imgPath = emotions[emotionName];
        const emotionContainer = document.createElement('div');
        emotionContainer.className = 'grid-item';
        emotionContainer.onclick = () => addPersonImageToCanvas(imgPath);

        const img = document.createElement('img');
        img.src = imgPath;
        img.alt = emotionName;

        const label = document.createElement('p');
        label.textContent = emotionName;

        emotionContainer.appendChild(img);
        emotionContainer.appendChild(label);
        emotionGrid.appendChild(emotionContainer);
    }
}

function addPersonImageToCanvas(src) {
    const flipped = document.getElementById('flip-person-image').checked;
    addObject('person', {
        src,
        flipped,
        height: 900,
        stroke: '#FFFF00', // Yellow
        strokeWidth: 20,
        shadow: {
            enabled: true,
            color: '#FFFF00', // Yellow shadow
            blur: 20,
            offsetX: 10,
            offsetY: -25
        }
    });
    closePersonPicker();
}