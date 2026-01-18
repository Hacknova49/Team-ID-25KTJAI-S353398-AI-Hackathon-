import pandas as pd

test_df = pd.read_csv('data/test_FD001.txt', sep=' ', header=None)
test_df.drop(test_df.columns[[26, 27]], axis=1, inplace=True)
test_df.columns = ['engine_id', 'cycle', 'op_setting_1', 'op_setting_2', 'op_setting_3'] + \
                  [f'sensor_{i}' for i in range(1, 22)]

engine_2 = test_df[test_df['engine_id'] == 2]
print(f'Engine 2 total cycles: {len(engine_2)}')
print(f'Max cycle number: {engine_2["cycle"].max()}')
print(f'Min cycle number: {engine_2["cycle"].min()}')
