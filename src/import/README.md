---
eleventyExcludeFromCollections: true
layout: false
---

# 📂 Content Update Guide

This folder contains the master data for the website. Follow these steps to update the content using Excel.

---

## 🚀 Quick Workflow
1.  **Open**: Open `event_input.xlsx` in Excel or Google Sheets.
2.  **Edit**: Update the data in the provided sheets.
3.  **Close**: **IMPORTANT!** You must close the Excel application before syncing.
4.  **Sync**: Run the command `npm run convert` in your terminal.
5.  **Check**: The website will automatically update with the new data.

---

## 📊 Excel Structure

### 1. Sheet: `Speakers`
* **Sort**: A unique number (e.g., `01`, `02`). This links the speaker to the schedule.
* **Name**: Full name of the speaker.
* **Role**: Title or organization.
* **Img**: Image URL (e.g., `https://i.pravatar.cc/300?u=1`).
* **Bio**: Short biography. **HTML tags are supported.**

### 2. Sheet: `Schedules`
* **Time**: Schedule timing (e.g., `09:00 - 10:00`).
* **Title**: Session title.
* **SpeakerSort**: Enter the **Sort** number from the Speakers sheet (leave blank if no speaker).
* **Description**: Details about the session. **HTML tags are supported.**
* **Type**: Use `Plenary` for main sessions or `Session` for regular breakouts.

---

## ✍️ Content Formatting (HTML)
You can use basic HTML tags directly inside Excel cells to style your text:

| Effect | HTML Tag | Example in Excel |
| :--- | :--- | :--- |
| **Bold** | `<b>...</b>` | `This is a <b>Very Important</b> session.` |
| *Italics* | `<i>...</i>` | `Discussing <i>Modern Ethics</i>.` |
| <u>Underline</u> | `<u>...</u>` | `See <u>Attached Document</u>.` |
| Link | `<a href='...'>...</a>` | `<a href='https://google.com'>Click Here</a>` |

> **Note:** Use single quotes (`'`) for links inside the tag to avoid data errors.

---

## 🛠 Troubleshooting
* **"Resource Busy/Locked" Error**: This means the Excel file is still open. Close Excel and try again.
* **Data not changing**: Make sure you saved the Excel file and ran the `npm run convert` command.
* **Weird characters**: If you copy-paste from PDF/Word, try to "Paste as Plain Text" to avoid hidden formatting.

---