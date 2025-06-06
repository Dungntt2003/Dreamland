import { format } from "date-fns";

const formatDate = (isoString) => format(new Date(isoString), "dd-MM-yy");

export default formatDate;
