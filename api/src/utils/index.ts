export enum RESPONSE_STATUS {
  SUCCESS = 1,
  FAILED = 0,
}

//task
export enum STATUS_TASK {
  WAITING = 'waiting',
  WORKING = 'working',
  REVIEWING = 'reviewing',
  NOT_COMPLETE = 'not_complete',
  COMPLETE = 'complete',
  EXPIRED = 'expired',
  PAUSE = 'pause',
  CANCELED = 'canceled',
  CLOSED = 'closed',
}

export const arrayStatusTask: string[] = [
  STATUS_TASK.WAITING,
  STATUS_TASK.WORKING,
  STATUS_TASK.REVIEWING,
  STATUS_TASK.NOT_COMPLETE,
  STATUS_TASK.COMPLETE,
  STATUS_TASK.EXPIRED,
  STATUS_TASK.PAUSE,
  STATUS_TASK.CANCELED,
  STATUS_TASK.CLOSED,
];

export enum TYPE_TASK {
  NOT_URGENT_NOT_IMPORTANT = 'not_urgent_not_important',
  NOT_URGENT_IMPORTANT = 'not_urgent_important',
  URGENT_NOT_IMPORTANT = 'urgent_not_important',
  URGENT_IMPORTANT = 'urgent_important',
}

export enum PRIORITY_TASK {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
}

export enum CALCULATE_PROCESS_TASK {
  // Theo % người dùng tự cập nhật
  BY_USER_CUSTOM = 1,
  // Theo tỷ lệ hoàn thành khối lượng công việc
  BY_WORKLOAD_COMPLETE = 2,
  //Theo tỷ lệ hoàn thành đầu việc
  BY_JOB_COMPLETION_RATE = 3,
  // Theo tỷ trọng công việc con
  BY_PROPORTION_OF_CHILDREN_WORK = 4,
}

export enum RULE_TASK {
  // Không cho phép người thực hiện công việc này xem được công việc chéo thuộc cùng một công việc cha
  PERFORMER_THIS_TASK_CANNOT_SEE_OTHER_TASK = 1,
  // Không cho phép người thực hiện công việc cha xem được công việc này
  PERFORMER_PARENT_CANNOT_SEE_THIS_TASK = 2,
  // Không cho phép người theo dõi công việc cha xem được công việc này
  FOLLOWER_PARENT_CANNOT_SEE_THIS_TASK = 3,
  // Không cho phép người theo dõi xem được các công việc con thuộc công việc cha
  FOLLOWER_PARENT_CANNOT_SEE_TASK_CHILD = 4,
}

// project
export enum STATUS_PROJECT {
  WAITING = 'waiting',
  WORKING = 'working',
  COMPLETE = 'complete',
  PAUSE = 'pause',
  CANCELED = 'canceled',
}

export const arrayStatusProject: string[] = [
  STATUS_PROJECT.WAITING,
  STATUS_PROJECT.WORKING,
  STATUS_PROJECT.COMPLETE,
  STATUS_PROJECT.PAUSE,
  STATUS_PROJECT.CANCELED,
];

export enum CALCULATE_PROCESS_PROJECT {
  // Theo bình quân % hoàn thành của các công việc
  BY_AVERAGE_COMPLETE = 1,
  // Theo tỷ trọng ngày thực hiện
  BY_PERCENTAGE_IMPLEMENTATION_DAY = 2,
  // Theo tỷ trọng công việc
  BY_PERCENTAGE_TASK = 3,
}

export enum RULE_PROJECT {
  // Khi thời gian thực hiện dự án thay đổi thì thời gian công việc thay đổi theo
  WHEN_CHANGE_PROJECT_TIME_THEN_TASK_TIME_IS_CHANGED = 1,
  // Không cho phép người thực hiện xem được công việc chéo thuộc cùng một dự án
  PERFORMER_THIS_TASK_CANNOT_SEE_OTHER_TASK = 2,
  // Không cho phép người theo dõi xem được các công việc con thuộc dự án
  FOLLOWER_PARENT_CANNOT_SEE_TASK_CHILD_OF_THIS_PROJECT = 3,
}

export enum FILTER_TODO {
  ALL = 'tat-ca',
  PERFORM = 'thuc-hien',
  MANAGER = 'quan-tri',
  FOLLOW = 'theo-doi',
  ASSIGNEE = 'giao-viec',
}

export const removeUndefinedProperties = (obj: any) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
};

export enum DISCUSS_STATUS {
  DELETED = 0,
  SUCCESS = 1,
  PENDING = 2,
}

export enum DISCUSS_TYPE {
  TEXT = 'text',
  FILE = 'file',
  IMAGE = 'image',
}

export enum LOG_PROJECT_TYPE {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export const genStatusToVietnamese = (status: string) => {
  switch (status) {
    case STATUS_TASK.WAITING:
      return 'Đang chờ';
    case STATUS_TASK.WORKING:
      return 'Đang thực hiện';
    case STATUS_TASK.REVIEWING:
      return 'Đang đánh giá';
    case STATUS_TASK.NOT_COMPLETE:
      return 'Chưa hoàn thành';
    case STATUS_TASK.COMPLETE:
      return 'Hoàn thành';
    case STATUS_TASK.EXPIRED:
      return 'Đã hết hạn';
    case STATUS_TASK.PAUSE:
      return 'Tạm dừng';
    case STATUS_TASK.CANCELED:
      return 'Đã hủy';
    case STATUS_TASK.CLOSED:
      return 'Đã đóng';

    default:
      return '';
  }
};
