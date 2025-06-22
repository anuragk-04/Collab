import { configureStore } from "@reduxjs/toolkit";
import whiteboardSliceReducer from "../components/whiteboard/WhiteboardSlice";
import cursorSliceReducer from "../components/cursorOverlay/CursorSlice";

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardSliceReducer,
    cursor: cursorSliceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["whiteboard/setElements"],
        ignoredPaths: ["whiteboard.elements"],
      },
    }),
});
