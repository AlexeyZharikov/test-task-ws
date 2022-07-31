const content = document.querySelector(".content-inner");
const yearFilter = document.querySelector(".year-filter");
const makeFilter = document.getElementById("make-filter");
const modelFilter = document.getElementById("model-filter");
const trimFilter = document.getElementById("trim-filter");
const dropItems = document.querySelectorAll(".card");
const questionsBlock = document.getElementById('accordion');
const sortItems = document.querySelectorAll('.dropdown-item.sort-item');

const {
  default: cars
} = await import("./cars.json", {
  assert: {
    type: "json"
  }
});
const {
  default: questions
} = await import("./questions.json", {
  assert: {
    type: "json"
  }
});


const allQuestions = questions.map(item => {
  return `<div class="accordion-item">
    <div class="accordion-header" id="${item.headingId}">
      <button class="accordion-button collapsed" type="button" 
      data-bs-toggle="collapse" data-bs-target="${item.dataBsTarget}" 
      aria-expanded="false" aria-controls="${item.ariaControls}">
        ${item.questionNum}. ${item.questionHeader}
      </button>
    </div>
    <div id="${item.itemId}" class="accordion-collapse collapse" aria-labelledby="${item.ariaLabelledby}">
      <div class="accordion-body">
        ${item.text.map(m => {
          return `<p>${m.textp}</p>`
        }).join('')
      }
      </div>
    </div>
  </div>`
})
questionsBlock.innerHTML = allQuestions.join('')

const render = (arr) => {
  content.innerHTML = "";
  let newArr = [...arr];
  const filteredList = newArr.map(car => {
    return `<div class="card-wrap col-lg-6 col-md-4">
    <div class="card">
      <div class="image"> 
        <img class="card-img-top car-photo" src="${car.photo}" alt="car photo">
      </div>
      <div class="sold ${car.sold ? "sold-label" : ""}"></div>
      <div class="new ${car.new ? "new-label" : ""}"></div>
      <div class="card-body">
        <p class="card-title"><span class="year">${car.year} </span>${car.make} ${car.model}</p>
        <p class="card-text"><span class="odo">${Intl.NumberFormat("en").format(car.odo)} </span> | <span class="type"> ${car.type} </span> | <span class="fuel"> ${car.fuel}</span></p>
        <h5 class="price">$${Intl.NumberFormat("en").format(car.price)}</h5>
      </div>
    </div></div>`
  })
  content.innerHTML = filteredList.join('')
}
render(cars)

const uniqueYear = cars.reduce((acc, car) => acc.map[car.year] ? acc : ((acc.map[car.year] = true),
  acc.uniqueYear.push(car), acc), {
  map: {},
  uniqueYear: []
}).uniqueYear;
uniqueYear.sort((a, b) => a.year > b.year ? 1 : -1)
yearFilter.innerHTML = uniqueYear.map(car => {
  return `<li class="dropdown-item year" value="${car.year}">${car.year}</li>`
}).join('');

const uniqueMake = cars.reduce((acc, car) => acc.map[car.make] ? acc : ((acc.map[car.make] = true),
  acc.uniqueMake.push(car), acc), {
  map: {},
  uniqueMake: []
}).uniqueMake;
uniqueMake.sort((a, b) => a.make > b.make ? 1 : -1);
makeFilter.innerHTML = uniqueMake.map(car => {
  return `<li class="dropdown-item make" value="${car.make}">${car.make}</li>`
}).join('');

const uniqueModel = cars.reduce((acc, car) => acc.map[car.model] ? acc : ((acc.map[car.model] = true),
  acc.uniqueModel.push(car), acc), {
  map: {},
  uniqueModel: []
}).uniqueModel;
uniqueModel.sort((a, b) => a.model > b.model ? 1 : -1);
modelFilter.innerHTML = uniqueModel.map(car => {
  return `<li class="dropdown-item model" value="${car.model}">${car.model}</li>`
}).join('');

const uniqueTrim = cars.reduce((acc, car) => acc.map[car.fuel] ? acc : ((acc.map[car.fuel] = true),
  acc.uniqueTrim.push(car), acc), {
  map: {},
  uniqueTrim: []
}).uniqueTrim;
uniqueTrim.sort((a, b) => a.fuel > b.fuel ? 1 : -1);
trimFilter.innerHTML = uniqueTrim.map(car => {
  return `<li class="dropdown-item trim" value="${car.fuel}">${car.fuel}</li>`
}).join('');

const less50 = [];
const from50To100 = [];
const more100 = [];

for (const car of cars) {
  if (car.odo <= 50000) {
    less50.push(car);
  } else if (car.odo > 50000 && car.odo < 100000) {
    from50To100.push(car);
  } else {
    more100.push(car);
  }
}

const years = document.querySelectorAll('.dropdown-item.year');
years.forEach((year) => {
  year.addEventListener('click', () => {
    const filtered = cars.filter((item) => item.year === year.value);
    render(filtered);
  });

})

const makes = document.querySelectorAll('.dropdown-item.make');
makes.forEach((make) => {
  make.addEventListener('click', () => {
    const filtered = cars.filter((item) =>
      item.make === make.textContent);
    render(filtered);
  });
})

const models = document.querySelectorAll('.dropdown-item.model');
models.forEach((model) => {
  model.addEventListener('click', () => {
    const filtered = cars.filter((item) =>
      item.model === model.textContent);
    render(filtered);
  });
})

const trims = document.querySelectorAll('.dropdown-item.trim');
trims.forEach((trim) => {
  trim.addEventListener('click', () => {
    const filtered = cars.filter((item) =>
      item.fuel === trim.textContent);
    render(filtered);
  });
})

const odos = document.querySelectorAll('.dropdown-item.mileage');
odos.forEach((odo) => {
  odo.addEventListener('click', () => {
    if (odo.textContent === "less 50,000") {
      render(less50)
    } else if (odo.textContent === "50,000 to 100,000") {
      render(from50To100)
    } else if (odo.textContent === "more 100,000") {
      render(more100)
    }
  })
})

const allCarBtn = document.querySelector('.btn.btn-secondary.show-all');
allCarBtn.addEventListener("click", () => {
  render(cars)
});

const availVeh = cars.filter((car) => car.sold === false);

const chckbox = document.querySelector('input.form-check-input');
chckbox.addEventListener("click", () => {
  chckbox.checked ? render(availVeh) : render(cars);
});


