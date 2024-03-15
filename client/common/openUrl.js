export function openUrl(link) {
  window.open(link + "&source=you", "_blank");
}

export const STATUS_POST = {
  0: "Chờ leader duyệt",
  1: "Chờ trợ lý duyệt",
  2: "Đang hoạt động",
  3: "Đã tắt",
  4: "Leader từ chối",
  5: "Trợ lý từ chối",
  6: "Đã đủ số lượng hôm nay",
};
