// ('https://world.openfoodfacts.org/api/v2/product/3017624010701.json')
const body = document.body
const h1 = document.createElement('h1')
h1.innerText = 'Food Allergy Scanner'
body.appendChild(h1)

const mainDiv = document.createElement('div')
mainDiv.classList.add('mainContainer')

const inputForBarcode = document.createElement('input')
inputForBarcode.classList.add('barcode')
inputForBarcode.placeholder = 'Barcode: 3017620422003'
inputForBarcode.type = 'Text'
mainDiv.appendChild(inputForBarcode)

const inputForAllergns = document.createElement('input')
inputForAllergns.classList.add('ingre')
inputForAllergns.placeholder = 'Milk'
inputForAllergns.type = 'Text'
mainDiv.appendChild(inputForAllergns)

const but = document.createElement('button')
but.classList.add('SubmitBTN')
but.innerText = 'Submit'
mainDiv.appendChild(but)

body.appendChild(mainDiv)

const para = document.createElement('p')
para.classList.add('paragraph')

mainDiv.appendChild(para)

but.addEventListener('click', allergy)

async function allergy() {
  
  const barcode=inputForBarcode.value.trim()
  const allergens=inputForAllergns.value.trim().toLocaleLowerCase()
  if (!barcode || !allergens) {
    para.innerText='Code Theek Lagao'
    return
  }
  para.innerText = "⏳ Checking product...";
  try {
    
    const result = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`)
    const data = await result.json()
    console.log(data)
    if(data.status===0){
        para.innerText='❌ Product not found'
        return
    }
    const nameofProduct=data.product.product_name || 'Unknown'
    const ingredientsUsed=data.product.ingredients_tags || 'No ingredients Match'

    const allergyInputList=inputForAllergns.value.split(',').map(item=>item.trim().toLocaleLowerCase())
    const allergyKoMatchKr=allergyInputList.filter(allergen=>data.product.ingredients_tags.includes(allergen))
    console.log(allergyKoMatchKr);
    let warning;
    if(allergyKoMatchKr.length>0){
        warning=`⚠️ Allergy Alert! Found: ${allergyKoMatchKr.join(', ')} in ${nameofProduct}`
    }
    else{
        warning = `✅ Safe! No listed allergens found in ${nameofProduct}`
    }
    para.innerHTML = `
            <strong>Name:</strong> ${nameofProduct}<br>
            <strong>Ingredients:</strong> ${ingredientsUsed}<br>
            <strong>${warning}</strong>
        `;

  } catch (err) {
    console.log(err)
    para.innerText = 'There is error in code'
  }
}
