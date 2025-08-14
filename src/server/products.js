import { findIndexInColumn, getProductSheet } from './sheet';

export const COLUMN_IDX_OF_PRODUCT_ID = 0; // 第一個直欄，又稱A欄，用來儲存產品ID

const defVal = (v, def = null) => v || def;

const rowValidator = (r) => Array.isArray(r) && r.length > 0;

// common separate string
const cssDefVal = (css, def = null) => {
  if (!css) return def;
  return css.split(',').map((s) => s.trim());
};

const row2product = (r) => ({
  id: r[COLUMN_IDX_OF_PRODUCT_ID],
  name: defVal(r[1], '尚未命名'),
  imgUrl: defVal(r[2]),
  imgAlt: `${defVal(r[1], '')}產品圖`,
  fullImgUrl: defVal(r[3]),
  orgPrice: defVal(r[4]),
  price: defVal(r[5]),
  priceList: cssDefVal(r[6]),
  stars: defVal(r[7]),
  detail: defVal(r[8], ''),
  thumbnailUrl: defVal(r[9], ''),
});

export function getProductById(prodId) {
  Logger.log(`getProductById ${prodId}`);
  const sheet = getProductSheet();
  const rowIdx = findIndexInColumn(prodId, COLUMN_IDX_OF_PRODUCT_ID, sheet);
  if (rowIdx < 0) {
    throw new Error(`找不到產品${prodId}的內容`);
  }
  const prods = sheet
    .getRange(
      1 + rowIdx,
      1 + COLUMN_IDX_OF_PRODUCT_ID,
      1,
      sheet.getLastColumn()
    )
    .getValues()
    .filter(rowValidator)
    .map(row2product);
  return prods[0]; // 因為getValues會取回[[...]],而在map後會得到[{}],而為了方便client使用,幫忙剝殼
}

export function getAllProducts() {
  const allProducts = getProductSheet().getDataRange().getValues();
  allProducts.shift(); // 移除掉第一個row(標題)
  return allProducts.filter(rowValidator).map(row2product);
}
