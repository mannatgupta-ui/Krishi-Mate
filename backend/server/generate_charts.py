import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Set style
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)

# Load Data
csv_path = "backend\server\APY.csv"
if not os.path.exists(csv_path):
    print(f"Error: {csv_path} not found.")
    exit()

df = pd.read_csv(csv_path)

# Clean Columns
df.columns = df.columns.str.strip()

# Calculate Yield if missing (assuming Yield = Production / Area)
# Some rows might need cleaning
df = df[df['Area'] > 0]
df['Calculated_Yield'] = df['Production'] / df['Area']

# 1. Top 10 States by Total Production
plt.figure()
state_prod = df.groupby('State')['Production'].sum().sort_values(ascending=False).head(10)
sns.barplot(x=state_prod.values, y=state_prod.index, palette="viridis")
plt.title('Top 10 States by Total Agricultural Production')
plt.xlabel('Total Production (Tonnes)')
plt.ylabel('State')
plt.tight_layout()
plt.savefig("chart_top_states_production.png")
print("Generated chart_top_states_production.png")

# 2. Yield Trend over Years for Top 5 Crops
plt.figure()
top_crops = df.groupby('Crop')['Production'].sum().sort_values(ascending=False).head(5).index
df_top = df[df['Crop'].isin(top_crops)]
sns.lineplot(data=df_top, x='Crop_Year', y='Calculated_Yield', hue='Crop')
plt.title('Yield Trend (Tonnes/Hectare) for Top 5 Major Crops')
plt.ylabel('Yield (Tonnes/Ha)')
plt.xlabel('Year')
plt.tight_layout()
plt.savefig("chart_yield_trends.png")
print("Generated chart_yield_trends.png")

# 3. Distribution of production by Season
plt.figure(figsize=(8, 8))
season_prod = df.groupby('Season')['Production'].sum()
plt.pie(season_prod, labels=season_prod.index, autopct='%1.1f%%', colors=sns.color_palette('pastel'))
plt.title('Crop Production Distribution by Season')
plt.tight_layout()
plt.savefig("chart_season_distribution.png")
print("Generated chart_season_distribution.png")
