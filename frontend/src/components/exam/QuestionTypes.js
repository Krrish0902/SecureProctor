import React from 'react';
import { 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  TextField, 
  Typography, 
  Paper, 
  Box 
} from '@mui/material';

export const MultipleChoice = ({ question, value, onChange }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {question.question}
      </Typography>
      <RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
        {question.options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
    </Paper>
  );
};

export const EssayQuestion = ({ question, value, onChange }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {question.question}
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
      />
    </Paper>
  );
};